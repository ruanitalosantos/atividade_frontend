import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BusinessIcon from '@mui/icons-material/Business';
import { PageHeader } from '../components/PageHeader';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { FeedbackSnackbar } from '../components/FeedbackSnackbar';
import { storage } from '../services/storage';

export function DepartamentosPage() {
  const [departamentos, setDepartamentos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);

  // Form State
  const [formData, setFormData] = useState({ nome: '' });
  const [errors, setErrors] = useState({});

  // Confirm Delete State
  const [deleteId, setDeleteId] = useState(null);

  // Snackbar State
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadDepartamentos();
  }, []);

  const loadDepartamentos = () => {
    const data = storage.getDepartamentos();
    setDepartamentos(data);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenAddModal = () => {
    setEditingDept(null);
    setFormData({ nome: '' });
    setErrors({});
    setOpenModal(true);
  };

  const handleOpenEditModal = (dept) => {
    setEditingDept(dept);
    setFormData({ nome: dept.nome });
    setErrors({});
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingDept(null);
    setFormData({ nome: '' });
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nome.trim()) {
      newErrors.nome = 'O nome do departamento é obrigatório.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    if (editingDept) {
      // Update
      const updatedList = departamentos.map((item) =>
        item.id === editingDept.id ? { ...item, nome: formData.nome.trim() } : item
      );
      storage.saveDepartamentos(updatedList);
      setDepartamentos(updatedList);
      showSnackbar('Departamento atualizado com sucesso!');
    } else {
      // Create
      const newId = departamentos.length > 0 ? Math.max(...departamentos.map((d) => d.id)) + 1 : 1;
      const newDept = {
        id: newId,
        nome: formData.nome.trim(),
      };
      const updatedList = [...departamentos, newDept];
      storage.saveDepartamentos(updatedList);
      setDepartamentos(updatedList);
      showSnackbar('Departamento cadastrado com sucesso!');
    }

    handleCloseModal();
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    const updatedList = departamentos.filter((d) => d.id !== deleteId);

    // Clean up allocations associated with deleted department
    const allocations = storage.getAllocations();
    const updatedAllocations = allocations.filter((a) => a.departamentoId !== deleteId);
    storage.saveAllocations(updatedAllocations);

    storage.saveDepartamentos(updatedList);
    setDepartamentos(updatedList);
    setDeleteId(null);
    showSnackbar('Departamento excluído com sucesso!');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader
        title="Gerenciamento de Departamentos"
        subtitle="Visualize, cadastre, edite e remova departamentos acadêmicos."
        actionLabel="Novo Departamento"
        onAction={handleOpenAddModal}
      />

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table aria-label="tabela de departamentos">
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Nome do Departamento</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departamentos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Nenhum departamento cadastrado.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              departamentos.map((dept) => (
                <TableRow key={dept.id} hover>
                  <TableCell>{dept.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BusinessIcon color="action" fontSize="small" />
                      <Typography variant="body2" fontWeight="500">
                        {dept.nome}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Editar">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenEditModal(dept)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(dept.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Form Dialog for Create/Update */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingDept ? 'Editar Departamento' : 'Cadastrar Novo Departamento'}
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <TextField
              label="Nome do Departamento"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              error={!!errors.nome}
              helperText={errors.nome}
              fullWidth
              required
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseModal} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {editingDept ? 'Salvar Alterações' : 'Cadastrar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir Departamento"
        message="Tem certeza que deseja excluir este departamento? Todas as alocações vinculadas a ele também serão removidas."
      />

      {/* Feedback Snackbar */}
      <FeedbackSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Container>
  );
}
