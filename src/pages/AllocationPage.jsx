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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Button,
  Typography,
  Box,
  Tooltip,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SchoolIcon from '@mui/icons-material/School';
import BookIcon from '@mui/icons-material/Book';
import BusinessIcon from '@mui/icons-material/Business';
import { PageHeader } from '../components/PageHeader';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { FeedbackSnackbar } from '../components/FeedbackSnackbar';
import { storage } from '../services/storage';

export function AllocationPage() {
  const [allocations, setAllocations] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [editingAllocation, setEditingAllocation] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    professorId: '',
    cursoId: '',
    departamentoId: '',
  });
  const [errors, setErrors] = useState({});

  // Confirm Delete State
  const [deleteId, setDeleteId] = useState(null);

  // Snackbar State
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setAllocations(storage.getAllocations());
    setProfessores(storage.getProfessores());
    setCursos(storage.getCursos());
    setDepartamentos(storage.getDepartamentos());
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenAddModal = () => {
    setEditingAllocation(null);
    setFormData({ professorId: '', cursoId: '', departamentoId: '' });
    setErrors({});
    setOpenModal(true);
  };

  const handleOpenEditModal = (allocation) => {
    setEditingAllocation(allocation);
    setFormData({
      professorId: allocation.professorId,
      cursoId: allocation.cursoId,
      departamentoId: allocation.departamentoId,
    });
    setErrors({});
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingAllocation(null);
    setFormData({ professorId: '', cursoId: '', departamentoId: '' });
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.professorId) {
      newErrors.professorId = 'Selecione um professor.';
    }
    if (!formData.cursoId) {
      newErrors.cursoId = 'Selecione um curso.';
    }
    if (!formData.departamentoId) {
      newErrors.departamentoId = 'Selecione um departamento.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const profId = Number(formData.professorId);
    const crsId = Number(formData.cursoId);
    const deptId = Number(formData.departamentoId);

    if (editingAllocation) {
      // Update
      const updatedList = allocations.map((item) =>
        item.id === editingAllocation.id
          ? { ...item, professorId: profId, cursoId: crsId, departamentoId: deptId }
          : item
      );
      storage.saveAllocations(updatedList);
      setAllocations(updatedList);
      showSnackbar('Alocação atualizada com sucesso!');
    } else {
      // Create
      const newId = allocations.length > 0 ? Math.max(...allocations.map((a) => a.id)) + 1 : 1;
      const newAllocation = {
        id: newId,
        professorId: profId,
        cursoId: crsId,
        departamentoId: deptId,
      };
      const updatedList = [...allocations, newAllocation];
      storage.saveAllocations(updatedList);
      setAllocations(updatedList);
      showSnackbar('Alocação cadastrada com sucesso!');
    }

    handleCloseModal();
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    const updatedList = allocations.filter((a) => a.id !== deleteId);
    storage.saveAllocations(updatedList);
    setAllocations(updatedList);
    setDeleteId(null);
    showSnackbar('Alocação excluída com sucesso!');
  };

  const getProfessorName = (id) => {
    const prof = professores.find((p) => p.id === id);
    return prof ? prof.nome : 'Desconhecido / Removido';
  };

  const getCursoName = (id) => {
    const crs = cursos.find((c) => c.id === id);
    return crs ? crs.nome : 'Desconhecido / Removido';
  };

  const getDepartamentoName = (id) => {
    const dept = departamentos.find((d) => d.id === id);
    return dept ? dept.nome : 'Desconhecido / Removido';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader
        title="Gerenciamento de Alocações"
        subtitle="Vincule professores a cursos e departamentos acadêmicos."
        actionLabel="Nova Alocação"
        onAction={handleOpenAddModal}
      />

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table aria-label="tabela de alocacoes">
          <TableHead sx={{ bgcolor: 'action.hover' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Professor</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Curso</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Departamento</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allocations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Nenhuma alocação cadastrada.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              allocations.map((alloc) => (
                <TableRow key={alloc.id} hover>
                  <TableCell>{alloc.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SchoolIcon color="primary" fontSize="small" />
                      <Typography variant="body2" fontWeight="500">
                        {getProfessorName(alloc.professorId)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<BookIcon fontSize="small" />}
                      label={getCursoName(alloc.cursoId)}
                      variant="outlined"
                      size="small"
                      color="secondary"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BusinessIcon color="action" fontSize="small" />
                      <Typography variant="body2">
                        {getDepartamentoName(alloc.departamentoId)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Editar">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenEditModal(alloc)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(alloc.id)}
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
          {editingAllocation ? 'Editar Alocação' : 'Cadastrar Nova Alocação'}
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            {/* Professor Selector */}
            <FormControl fullWidth error={!!errors.professorId} required>
              <InputLabel id="select-professor-label">Professor</InputLabel>
              <Select
                labelId="select-professor-label"
                label="Professor"
                value={formData.professorId}
                onChange={(e) => setFormData({ ...formData, professorId: e.target.value })}
              >
                {professores.map((prof) => (
                  <MenuItem key={prof.id} value={prof.id}>
                    {prof.nome} ({prof.email})
                  </MenuItem>
                ))}
              </Select>
              {errors.professorId && <FormHelperText>{errors.professorId}</FormHelperText>}
            </FormControl>

            {/* Curso Selector */}
            <FormControl fullWidth error={!!errors.cursoId} required>
              <InputLabel id="select-curso-label">Curso</InputLabel>
              <Select
                labelId="select-curso-label"
                label="Curso"
                value={formData.cursoId}
                onChange={(e) => setFormData({ ...formData, cursoId: e.target.value })}
              >
                {cursos.map((curso) => (
                  <MenuItem key={curso.id} value={curso.id}>
                    {curso.nome}
                  </MenuItem>
                ))}
              </Select>
              {errors.cursoId && <FormHelperText>{errors.cursoId}</FormHelperText>}
            </FormControl>

            {/* Departamento Selector */}
            <FormControl fullWidth error={!!errors.departamentoId} required>
              <InputLabel id="select-departamento-label">Departamento</InputLabel>
              <Select
                labelId="select-departamento-label"
                label="Departamento"
                value={formData.departamentoId}
                onChange={(e) => setFormData({ ...formData, departamentoId: e.target.value })}
              >
                {departamentos.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.nome}
                  </MenuItem>
                ))}
              </Select>
              {errors.departamentoId && <FormHelperText>{errors.departamentoId}</FormHelperText>}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseModal} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {editingAllocation ? 'Salvar Alterações' : 'Cadastrar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir Alocação"
        message="Tem certeza que deseja excluir esta alocação?"
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
