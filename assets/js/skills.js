const { createApp } = Vue;

createApp({
  data() {
    return {
      skills: [
        'Python',
        'Website development',
        'LaTeX',
        'MATLAB',
        'Catia',
        'Fortran',
        'SolidWorks',
        'C'
      ]
    };
  }
}).mount('#skills-app');
