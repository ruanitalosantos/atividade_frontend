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
import BookIcon from '@mui/icons-material/Book';
import { PageHeader } from '../components/PageHeader';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { FeedbackSnackbar } from '../components/FeedbackSnackbar';
import { storage } from '../services/storage';

export function CursosPage() {
  const [cursos, setCursos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingCurso, setEditingCurso] = useState(null);

  // Form State
  const [formData, setFormData] = useState({ nome: '' });
  const [errors, setErrors] = useState({});

  // Confirm Delete State
  const [deleteId, setDeleteId] = useState(null);

  // Snackbar State
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadCursos();
  }, []);

  const loadCursos = () => {
    const data = storage.getCursos();
    setCursos(data);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenAddModal = () => {
    setEditingCurso(null);
    setFormData({ nome: '' });
    setErrors({});
    setOpenModal(true);
  };

  const handleOpenEditModal = (curso) => {
    setEditingCurso(curso);
    setFormData({ nome: curso.nome });
    setErrors({});
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingCurso(null);
    setFormData({ nome: '' });
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nome.trim()) {
      newErrors.nome = 'O nome do curso é obrigatório.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    if (editingCurso) {
      // Update
      const updatedList = cursos.map((item) =>
        item.id === editingCurso.id ? { ...item, nome: formData.nome.trim() } : item
      );
      storage.saveCursos(updatedList);
      setCursos(updatedList);
      showSnackbar('Curso atualizado com sucesso!');
    } else {
      // Create
      const newId = cursos.length > 0 ? Math.max(...cursos.map((c) => c.id)) + 1 : 1;
      const newCurso = {
        id: newId,
        nome: formData.nome.trim(),
      };
      const updatedList = [...cursos, newCurso];
      storage.saveCursos(updatedList);
      setCursos(updatedList);
      showSnackbar('Curso cadastrado com sucesso!');
    }

    handleCloseModal();
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    const updatedList = cursos.filter((c) => c.id !== deleteId);

    // Clean up allocations associated with deleted course
    const allocations = storage.getAllocations();
    const updatedAllocations = allocations.filter((a) => a.cursoId !== deleteId);
    storage.saveAllocations(updatedAllocations);

    storage.saveCursos(updatedList);
    setCursos(updatedList);
    setDeleteId(null);
    showSnackbar('Curso excluído com sucesso!');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader
        title="Gerenciamento de Cursos"
        subtitle="Visualize, cadastre, edite e remova cursos da instituição."
        actionLabel="Novo Curso"
        onAction={handleOpenAddModal}
      />

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table aria-label="tabela de cursos">
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Nome do Curso</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cursos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Nenhum curso cadastrado.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              cursos.map((curso) => (
                <TableRow key={curso.id} hover>
                  <TableCell>{curso.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BookIcon color="action" fontSize="small" />
                      <Typography variant="body2" fontWeight="500">
                        {curso.nome}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Editar">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenEditModal(curso)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(curso.id)}
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
        <DialogTitle>{editingCurso ? 'Editar Curso' : 'Cadastrar Novo Curso'}</DialogTitle>
        <DialogContent dividers>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <TextField
              label="Nome do Curso"
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
            {editingCurso ? 'Salvar Alterações' : 'Cadastrar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir Curso"
        message="Tem certeza que deseja excluir este curso? Todas as alocações vinculadas a ele também serão removidas."
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
