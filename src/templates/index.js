import ProfessionalTemplate from './ProfessionalTemplate';
import CreativeTemplate from './CreativeTemplate';
import ExecutiveTemplate from './ExecutiveTemplate';
import AcademicTemplate from './AcademicTemplate';

export {
  ProfessionalTemplate,
  CreativeTemplate,
  ExecutiveTemplate,
  AcademicTemplate
};

// Map template IDs to template components
export const getTemplateById = (templateId) => {
  const templates = {
    "1": ProfessionalTemplate,
    "2": CreativeTemplate,
    "3": ExecutiveTemplate,
    "4": AcademicTemplate
  };
  
  return templates[templateId] || ProfessionalTemplate;
}; 