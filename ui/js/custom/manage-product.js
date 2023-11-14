var productModal = $("#productModal");
var updateProductModal = $("#updateProductModal");

$(function () {
    // JSON data by API call
    $.get(productListApiUrl, function (response) {
        if (response) {
            var table = '';
            $.each(response, function (index, product) {
                table += '<tr data-id="' + product.product_id + '" data-name="' + product.name + '" data-unit="' + product.uom_id + '" data-price="' + product.price_per_unit + '">' +
                    '<td>' + product.name + '</td>' +
                    '<td>' + product.uom_name + '</td>' +
                    '<td>' + product.price_per_unit + '</td>' +
                    '<td><span class="btn btn-xs btn-danger delete-product">Delete</span> <span class="btn btn-xs btn-warning update-product" data-toggle="modal" data-target="#updateProductModal" onclick="updateProduct(this)">Update</span></td></tr>';
            });
            $("table").find('tbody').empty().html(table);
        }
    });
});

// Add an event listener to the search input
$('#searchInput').on('input', function () {
    var searchValue = $(this).val().toLowerCase();

    // Filter the rows based on the search input
    $('table tbody tr').each(function () {
        var productName = $(this).find('td:first').text().toLowerCase();

        if (productName.includes(searchValue)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
});

// Save Product
$("#saveProduct").on("click", function () {
    // If we found id value in form then update product detail
    var data = $("#productForm").serializeArray();
    var requestPayload = {
        product_name: null,
        uom_id: null,
        price_per_unit: null
    };
    for (var i = 0; i < data.length; ++i) {
        var element = data[i];
        switch (element.name) {
            case 'name':
                requestPayload.product_name = element.value;
                break;
            case 'uoms':
                requestPayload.uom_id = element.value;
                break;
            case 'price':
                requestPayload.price_per_unit = element.value;
                break;
        }
    }
    callApi("POST", productSaveApiUrl, {
        'data': JSON.stringify(requestPayload)
    });
});

productModal.on('hide.bs.modal', function () {
    $("#id").val('0');
    $("#name, #unit, #price").val('');
    productModal.find('.modal-title').text('Add New Product');
});

productModal.on('show.bs.modal', function () {
    // JSON data by API call
    $.get(uomListApiUrl, function (response) {
        if (response) {
            var options = '<option value="">--Select--</option>';
            $.each(response, function (index, uom) {
                options += '<option value="' + uom.uom_id + '">' + uom.uom_name + '</option>';
            });
            $("#uoms").empty().html(options);
        }
    });
});

// Update Product
$("#saveUpdateProduct").on("click", function () {
    // If we found id value in the form, then update the product detail
    var data = $("#updateProductForm").serializeArray();
    var requestPayload = {
        product_id: null,
        product_name: null,
        uom_id: null,
        price_per_unit: null
    };
    for (var i = 0; i < data.length; ++i) {
        var element = data[i];
        switch (element.name) {
            case 'id':
                requestPayload.product_id = element.value;
                break;
            case 'name':
                requestPayload.product_name = element.value;
                break;
            case 'uoms':
                requestPayload.uom_id = element.value;
                break;
            case 'price':
                requestPayload.price_per_unit = element.value;
                break;
        }
    }
    // console.log(requestPayload);
    callApi("POST", productUpdateApiUrl, {
        'data': JSON.stringify(requestPayload)
    });
});

const productData = {}; // Initialize as an empty object
function updateProduct(button) {
    const row = button.closest('tr'); // Find the closest <tr> element
    const productId = row.dataset.id;
    const productName = row.dataset.name;
    const productUnit = row.dataset.unit;
    const productPrice = row.dataset.price;

    // Update the properties of the productData object
    productData.id = productId;
    productData.name = productName;
    productData.unit = productUnit;
    productData.price = productPrice;
}

updateProductModal.on('hide.bs.modal', function () {
    $('#updateProductId').val('0');
    $('#updateProductName, #updateProductUoms, #updateProductPrice').val('');
    updateProductModal.find('.modal-title').text('Update Product');
});

$("#updateProductModal").on('show.bs.modal', function () {
    // Populate the existing fields
    $('#updateProductId').val(productData.id);
    $('#updateProductName').val(productData.name);
    $('#updateProductUoms').val(productData.unit);
    $('#updateProductPrice').val(productData.price);

    // Add code to populate the dropdown for units
    $.get(uomListApiUrl, function (response) {
        if (response) {
            var options = '<option value="">--Select--</option>';
            $.each(response, function (index, uom) {
                options += '<option value="' + uom.uom_id + '">' + uom.uom_name + '</option>';
            });
            $("#updateProductUoms").empty().html(options);

            // Set the selected unit based on the productData
            // This assumes you have a way to map the "unit" in productData to the corresponding unit in the dropdown.
            $("#updateProductUoms").val(productData.unit);
        }
    });
});

// DELETE
$(document).on("click", ".delete-product", function () {
    var tr = $(this).closest('tr');
    var data = {
        product_id: tr.data('id')
    };
    var isDelete = confirm("Are you sure to delete " + tr.data('name') + " item?");
    if (isDelete) {
        callApi("POST", productDeleteApiUrl, data);
    }
});
