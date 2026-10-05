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
import SchoolIcon from '@mui/icons-material/School';
import { PageHeader } from '../components/PageHeader';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { FeedbackSnackbar } from '../components/FeedbackSnackbar';
import { storage } from '../services/storage';

export function ProfessoresPage() {
  const [professores, setProfessores] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState(null);

  // Form State
  const [formData, setFormData] = useState({ nome: '', email: '' });
  const [errors, setErrors] = useState({});

  // Confirm Delete State
  const [deleteId, setDeleteId] = useState(null);

  // Snackbar State
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadProfessores();
  }, []);

  const loadProfessores = () => {
    const data = storage.getProfessores();
    setProfessores(data);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenAddModal = () => {
    setEditingProfessor(null);
    setFormData({ nome: '', email: '' });
    setErrors({});
    setOpenModal(true);
  };

  const handleOpenEditModal = (professor) => {
    setEditingProfessor(professor);
    setFormData({ nome: professor.nome, email: professor.email });
    setErrors({});
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingProfessor(null);
    setFormData({ nome: '', email: '' });
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nome.trim()) {
      newErrors.nome = 'O nome é obrigatório.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'O e-mail é obrigatório.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Insira um e-mail válido (ex: professor@fafire.edu.br).';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    if (editingProfessor) {
      // Update
      const updatedList = professores.map((item) =>
        item.id === editingProfessor.id
          ? { ...item, nome: formData.nome.trim(), email: formData.email.trim() }
          : item
      );
      storage.saveProfessores(updatedList);
      setProfessores(updatedList);
      showSnackbar('Professor atualizado com sucesso!');
    } else {
      // Create
      const newId = profesores.length > 0 ? Math.max(...professores.map((p) => p.id)) + 1 : 1;
      const newProfessor = {
        id: newId,
        nome: formData.nome.trim(),
        email: formData.email.trim(),
      };
      const updatedList = [...professores, newProfessor];
      storage.saveProfessores(updatedList);
      setProfessores(updatedList);
      showSnackbar('Professor cadastrado com sucesso!');
    }

    handleCloseModal();
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    const updatedList = professores.filter((p) => p.id !== deleteId);

    // Clean up allocations associated with deleted professor
    const allocations = storage.getAllocations();
    const updatedAllocations = allocations.filter((a) => a.professorId !== deleteId);
    storage.saveAllocations(updatedAllocations);

    storage.saveProfessores(updatedList);
    setProfessores(updatedList);
    setDeleteId(null);
    showSnackbar('Professor excluído com sucesso!');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader
        title="Gerenciamento de Professores"
        subtitle="Visualize, cadastre, edite e remova professores do sistema."
        actionLabel="Novo Professor"
        onAction={handleOpenAddModal}
      />

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table aria-label="tabela de professores">
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>E-mail</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {professores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Nenhum professor cadastrado.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              professores.map((prof) => (
                <TableRow key={prof.id} hover>
                  <TableCell>{prof.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SchoolIcon color="action" fontSize="small" />
                      <Typography variant="body2" fontWeight="500">
                        {prof.nome}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{prof.email}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Editar">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenEditModal(prof)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(prof.id)}
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
          {editingProfessor ? 'Editar Professor' : 'Cadastrar Novo Professor'}
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <TextField
              label="Nome Completo"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              error={!!errors.nome}
              helperText={errors.nome}
              fullWidth
              required
            />
            <TextField
              label="Endereço de E-mail"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={!!errors.email}
              helperText={errors.email}
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
            {editingProfessor ? 'Salvar Alterações' : 'Cadastrar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir Professor"
        message="Tem certeza que deseja excluir este professor? Todas as alocações vinculadas a ele também serão removidas."
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
