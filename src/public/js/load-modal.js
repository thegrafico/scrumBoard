// $('#dynamic-content').load('file:///my-partial.html')

function loadModal(filePath) {
    $("#myModal").load(filePath);
}


$(document).ready(function() {

    // path for modal create
    let createModalPath = '../views/partials/create-modal.html';

    // load the modal once the document is fully loaded
    loadModal(createModalPath);
});