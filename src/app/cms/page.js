"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Input,
  MenuItem,
  IconButton,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/navigation";
import { useMessage } from "@/app/context/MessageContext";
import {
  getMedia,
  createMedia,
  updateMedia,
  deleteMedia,
} from "@/services/DisplayMediaService";
import ConfirmationDialog from "@/app/components/ConfirmationDialog";

const categoryOptions = {
  "About OSHRM": ["About OSHRM", "Why OSHRM"],
  "OSHRM People": ["Board", "Team"],
  "OSHRM Projects": [],
  Partners: [],
  "Professional Certifications": [],
  Upcoming: ["Coming soon", "Rest of the year"],
};

export default function CMSPage() {
  const router = useRouter();
  const { showMessage } = useMessage();
  const [mediaList, setMediaList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    file: null,
  });
  const [errors, setErrors] = useState({});
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMedia = async () => {
    try {
      const res = await getMedia();
      setMediaList(res.data || []);
    } catch {
      showMessage("Failed to load media.", "error");
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.category) newErrors.category = "Category is required.";
    if (categoryOptions[formData.category]?.length && !formData.subcategory)
      newErrors.subcategory = "Subcategory is required.";
    if (!editingItem && !formData.file)
      newErrors.file = "Please upload a file.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setActionLoading(true);
    try {
      const payload = new FormData();
      payload.append("category", formData.category);
      payload.append("subcategory", formData.subcategory || "");
      if (formData.file) payload.append("media", formData.file);

      const res = editingItem
        ? await updateMedia(editingItem._id, payload)
        : await createMedia(payload);

      showMessage(res.message || "Saved", "success");
      setOpenDialog(false);
      setEditingItem(null);
      setFormData({ category: "", subcategory: "", file: null });
      fetchMedia();
    } catch (err) {
      showMessage(err?.response?.data?.message || "Failed", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;

    setActionLoading(true);
    try {
      const res = await deleteMedia(selectedId);
      showMessage(res.message || "Deleted", "success");
      fetchMedia();
    } catch {
      showMessage("Failed to delete", "error");
    } finally {
      setActionLoading(false);
      setConfirmationOpen(false);
      setSelectedId(null);
    }
  };

  const openForm = (item = null) => {
    setEditingItem(item);
    setFormData({
      category: item?.category || "",
      subcategory: item?.subcategory || "",
      file: null,
    });
    setOpenDialog(true);
  };

  return (
    <Box sx={{ p: 4, position: "relative" }}>
      <Typography variant="h4" fontWeight="bold">
        Media Manager (CMS)
      </Typography>

      <IconButton
        sx={{ position: "absolute", top: 20, right: 20 }}
        onClick={() => router.push("/")}
      >
        <LogoutIcon />
      </IconButton>

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => openForm()}
        sx={{ mt: 2 }}
      >
        Add Media
      </Button>

      <Box sx={{ mt: 3 }}>
        {mediaList.map((item) => (
          <Box
          key={item._id}
          sx={{
            mb: 2,
            pb: 2,
            borderBottom: "1px solid #ccc",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
            maxWidth: "md",
            mx: "auto",
            width: "100%",
          }}
        >
          {/* 🖼 Image + Text Group */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2,
              flex: 1,
              width: "100%",
            }}
          >
            <Box sx={{ width: { xs: "100%", sm: "230px" } }}>
              {item.media?.type === "image" ? (
                <Box
                  component="img"
                  src={item.media.url}
                  alt={item.category}
                  sx={{
                    width: {xs:"100%", sm:"auto"},
                    height: {xs:"100%", sm:"130px"},
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: 100,
                    borderRadius: 2,
                    backgroundColor: "#eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 32,
                  }}
                >
                  🎥
                </Box>
              )}
            </Box>
        
            <Box>
              <Typography fontWeight="bold">{item.category}</Typography>
              <Typography>{item.subcategory || "—"}</Typography>
              <Typography variant="caption" color="text.secondary">
                {item.media?.type}
              </Typography>
            </Box>
          </Box>
        
          {/* 🔘 Edit / Delete Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              mt: { xs: 2, sm: 0 },
              width: { xs: "100%", sm: "auto" },
              justifyContent: { xs: "flex-end", sm: "flex-start" },
            }}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => openForm(item)}
              startIcon={<Edit />}
              fullWidth={true}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                setSelectedId(item._id);
                setConfirmationOpen(true);
              }}
              startIcon={<Delete />}
              fullWidth={true}
            >
              Delete
            </Button>
          </Box>
        </Box>        
        ))}
      </Box>

      {/* Form Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>{editingItem ? "Edit Media" : "Add Media"}</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Category"
            fullWidth
            sx={{ mt: 2 }}
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value,
                subcategory: "",
              })
            }
            error={!!errors.category}
            helperText={errors.category}
          >
            {Object.keys(categoryOptions).map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>

          {categoryOptions[formData.category]?.length > 0 && (
            <TextField
              select
              label="Subcategory"
              fullWidth
              sx={{ mt: 2 }}
              value={formData.subcategory}
              onChange={(e) =>
                setFormData({ ...formData, subcategory: e.target.value })
              }
              error={!!errors.subcategory}
              helperText={errors.subcategory}
            >
              {categoryOptions[formData.category].map((subcat) => (
                <MenuItem key={subcat} value={subcat}>
                  {subcat}
                </MenuItem>
              ))}
            </TextField>
          )}

          <Input
            type="file"
            sx={{ mt: 2 }}
            onChange={(e) =>
              setFormData({ ...formData, file: e.target.files[0] })
            }
            error={!!errors.file}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Save"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={handleDelete}
        title="Delete Media"
        message="Are you sure you want to delete this media?"
        confirmButtonText={
          actionLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Delete"
          )
        }
        confirmButtonProps={{ disabled: actionLoading }}
      />
    </Box>
  );
}
