const validateRequiredFields = (userData, fields) => {
    const errors = [];
  
    fields.forEach((field) => {
      if (!userData[field]) {
        errors.push(`${field} is required`);
      }
    });
  
    return errors;
  };
  
  module.exports = {
      validateRequiredFields
  }
