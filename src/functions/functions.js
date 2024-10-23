export function getRelatedRecords(module, registerID, related) {
  return new Promise(function (resolve, reject) {
    window.ZOHO.CRM.API.getRelatedRecords({
      Entity: module,
      RecordID: registerID,
      RelatedList: related,
      page: 1,
      per_page: 200,
    })
      .then(function (response) {
        const register = response.data;
        resolve({ register });
      })
      .catch(function (error) {
        reject(error);
      });
  });
}
