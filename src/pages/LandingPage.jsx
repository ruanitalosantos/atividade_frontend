import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import BookIcon from '@mui/icons-material/Book';
import BusinessIcon from '@mui/icons-material/Business';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export function LandingPage() {
  const cards = [
    {
      title: 'Allocation (Alocações)',
      description: 'Gerencie a vinculação de professores aos seus respectivos cursos e departamentos.',
      path: '/allocation',
      icon: <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      btnText: 'Gerenciar Alocações',
    },
    {
      title: 'Professores',
      description: 'Cadastre, especifique e gerencie o corpo docente da instituição.',
      path: '/professores',
      icon: <SchoolIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      btnText: 'Gerenciar Professores',
    },
    {
      title: 'Cursos',
      description: 'Cadastre e mantenha a lista de cursos oferecidos pela faculdade.',
      path: '/cursos',
      icon: <BookIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      btnText: 'Gerenciar Cursos',
    },
    {
      title: 'Departamentos',
      description: 'Organize a estrutura acadêmica cadastrando os departamentos existentes.',
      path: '/departamentos',
      icon: <BusinessIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      btnText: 'Gerenciar Departamentos',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Hero Section */}
      <Paper
        elevation={3}
        sx={{
          p: { xs: 4, md: 6 },
          mb: 6,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <SchoolIcon sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Sistema de Alocação de Professores
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: 800, mx: 'auto', opacity: 0.9, mb: 3 }}>
          Projeto desenvolvido para a atividade avaliativa da disciplina de Frontend da FAFIRE.
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 750, mx: 'auto', opacity: 0.85 }}>
          Esta aplicação permite realizar o gerenciamento completo (CRUD) de professores, cursos,
          departamentos e suas respectivas alocações no sistema de ensino.
        </Typography>
      </Paper>

      {/* Access Cards */}
      <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
        Módulos do Sistema
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.path}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ mb: 2 }}>{card.icon}</Box>
                <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  component={Link}
                  to={card.path}
                  variant="outlined"
                  fullWidth
                  endIcon={<ArrowForwardIcon />}
                >
                  {card.btnText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
