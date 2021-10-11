export function accessibleRouteChangeHandler() {
  return window.setTimeout(() => {
    const mainContainer = document.getElementById("primary-app-container");
    if (mainContainer) {
      mainContainer.focus();
    }
  }, 50);
}

export function convertBlobToBase64(imageBase64: Blob) {
  return new Promise((resolve,reject) => {
     const reader = new FileReader();
     reader.onload = () => resolve(reader.result);
     reader.onerror = error => reject(error);
     reader.readAsDataURL(imageBase64);
  });
}

export function convertBase64ToBlob(base64Image: string) {
  const parts = base64Image.split(';base64,');
  const imageType = parts[0].split(':')[1];
  const decodedData = window.atob(parts[1]);
  const uInt8Array = new Uint8Array(decodedData.length);
  
  for (let i = 0; i < decodedData.length; ++i) {
    uInt8Array[i] = decodedData.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: imageType });
}

//expects YYYY-MM-DD
//returns MM-DD-YYYY or YYYY-MM-DD if it does not start with YYYY
export function dateConvert(date: string) { 
  if ( !date || date =="") {
    return "";
  }
  //if the date is YYYY-MM-DD
  //return MM-DD-YYYY
  if ( date.split('-')[0].length == 4) {
    const year = date.split('-')[0];
    const day = date.split('-')[2].length == 1 ? ("0" + date.split('-')[2].slice(-2)) : date.split('-')[2];
    const month = date.split('-')[1].length == 1 ? ("0" + date.split('-')[1].slice(-2)) : date.split('-')[1];
    return [month, day, year].join('-');
    
  }
  //converts MM-DD-YYYY into YYYY-MM-DD
  const euDate = new Date(date.replace(/-/g,'/'));
  return [euDate.getFullYear(), ("0" + (euDate.getMonth() + 1)).slice(-2), ("0" + euDate.getDate()).slice(-2)].join('-');  
}

//expects YYYY-DD-MM
//returns MM-DD-YYYY or YYYY-MM-DD if it does not start with YYYY
export function dateConvert2(date:string) {
  if ( date =="") {
    return "";
  }
  //if the date comes back as YYYY-MM-DD
  if ( date.split('-')[0].length == 4) {
    const year = date.split('-')[0];
    const month = date.split('-')[2].length == 1 ? ("0" + date.split('-')[2].slice(-2)) : date.split('-')[2];
    const day = date.split('-')[1].length == 1 ? ("0" + date.split('-')[1].slice(-2)) : date.split('-')[1];
    
    return [month, day, year].join('-');
  }
  //should be stored in the backend as YYYY-MM-DD
  const euDate = new Date(date);
  return [euDate.getFullYear(), ("0" + (euDate.getMonth() + 1)).slice(-2), ("0" + euDate.getDate()).slice(-2)].join('-');
}

export function americanDateFormat(date) {
  const split = date.split('-');
  if (split.length !== 3) {
    return new Date();
  }
  const month = split[0];
  const day = split[1];
  const year = split[2];
  return new Date(`${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`);
}

export function birthDateValidator(date) {
  const today = new Date();
  const minDate = new Date(1921, 0, 1);

  if(date > today){
    return "Date cannot be in the future, please choose another.";
  }
  else if(date < minDate) {
    return "Birth year cannot be earlier than 01-01-1921.";
  }
  else {
    return "";
  }
}

//date must be earlier than current date aka "today", and greater than year 1921
export function birthDateRules(date) {
  const birthDate = new Date(date.replace(/-/g,'/'));
  return birthDate <= new Date() && birthDate >= new Date(1921, 0, 1);
}

export function covidTestDateValidator(date) {
  const today = new Date();
  const minDate = new Date(2021, 7, 1);

  if(date > today){
    return "Date cannot be in the future, please choose another.";
  }
  else if(date < minDate) {
    return "Test result date cannot be earlier than 08-01-2021.";
  }
  else {
    return "";
  }
}

export function covidTestDateRules(date) {
  const covidTestDate = new Date(date.replace(/-/g,'/'));
  return covidTestDate <= new Date() && covidTestDate >= new Date(2021, 7, 1);
}

export function covidVaxOneDateValidator(date) {
  const today = new Date();
  const minDate = new Date(2020, 5, 1);

  if(date > today){
    return "Date cannot be in the future, please choose another.";
  }
  else if(date < minDate) {
    return "Vaccination date cannot be earlier than 06-01-2020.";
  }
  else {
    return "";
  }
}

export function covidVaxOneDateRules(date) {
  const covidVaxOneDate = new Date(date.replace(/-/g,'/'));
  return covidVaxOneDate <= new Date() && covidVaxOneDate >= new Date(2020, 5, 1);
}

export function covidVaxTwoDateValidator(date, shotOneDate) {
  const today = new Date();
  const minDate = new Date(2020, 5, 1);

  if(date > today){
    return "Date cannot be in the future, please choose another.";
  }
  else if(date < minDate) {
    return "Vaccination date cannot be earlier than 06-01-2020.";
  }
  else if(shotOneDate && date <= shotOneDate) {
    return "Second shot date must be after the first shot date.";
  }
  else {
    return "";
  }
}

export function covidVaxTwoDateRules(date, shotOneDate) {
  if(!date) {
    return true; 
  }
  else {
    const covidVaxTwoDate = new Date(date.replace(/-/g,'/'));

    if(shotOneDate) {
      const covidVaxOneDate = new Date(shotOneDate.replace(/-/g,'/'));
      return covidVaxTwoDate <= new Date() && covidVaxTwoDate >= new Date(2020, 5, 1) && covidVaxTwoDate > covidVaxOneDate;
    }

    return covidVaxTwoDate <= new Date() && covidVaxTwoDate >= new Date(2020, 5, 1);
  }
}