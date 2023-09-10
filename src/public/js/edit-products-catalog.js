const socket = io();

// ADD A PRODUCT FORM
add_products.addEventListener("click", (e) => {
  e.preventDefault();
  if (myForm.style.display === "none") {
    myForm.style.display = "block";
  } else {
    myForm.style.display = "none";
  }
});

// Add Product Event
myForm.onsubmit = (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const description = document.getElementById("description").value;
  const code = document.getElementById("code").value;
  const price = parseInt(document.getElementById("price").value);
  const stock = parseInt(document.getElementById("stock").value);
  const category = document.getElementById("category").value;
  const thumbnail = document.getElementById("thumbnail").value;

  const product = {
    name,
    description,
    code,
    price,
    stock,
    category,
    thumbnail,
    operation: "add",
  };
  console.log('PRODUCTO RECIEN CREADO', product);
  
  socket.emit("operation", product);
};


function load_buttons() {

  // Update Form Appears Click
  const btnUpdates = Array.from(document.getElementsByClassName("edit"));
  let id_input = document.getElementById("id_edit_form");

  btnUpdates.forEach((b_edit) => {
    b_edit.addEventListener("click", (e) => {
      if (edit_form.style.display === "none") {
        edit_form.style.display = "block";
      } else {
        edit_form.style.display = "none";
      }
      let id = parseInt(e.target.closest("tr").id.slice(5));
      id_input.value = id;
      id_input.readOnly = true;
    });
  });

  // Update Product
  edit_form.onsubmit = (e) => {
    e.preventDefault();
    const input_vals = Array.from(
      document.querySelectorAll("#edit_form input")
    );
    const obj = {
      id: parseInt(input_vals[0].value),
      name: input_vals[1].value,
      description: input_vals[2].value,
      price: parseInt(input_vals[3].value),
      stock: parseInt(input_vals[4].value),
      category: input_vals[5].value,
      thumbnail: input_vals[6].value,
      operation: "update",
    };
    console.log(obj);
    socket.emit("operation", obj);
  };

  // Delete Product Event:
  const btnDeletes = Array.from(document.getElementsByClassName("delete"));
  console.log(btnDeletes);
  btnDeletes.forEach((b_delete) => {
    b_delete.addEventListener("click", (e) => {
      e.preventDefault();
      let obj = {
        id: parseInt(e.target.closest("tr").id.slice(5)),
        operation: "delete",
      };
      socket.emit("operation", obj);
    });
  });
}

load_buttons();

// Socket Operation
socket.on("reload-table", (products) => {
  const tbody = document.getElementById("tbody");
  let html = "";
  products.forEach((product) => {
    html += `<tr id="item-${product.id}">
            <th scope="row" class="id_prod">${product.id}</th>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td><button type="button" class="btn edit">
                <span class="button__icon">
                    <ion-icon name="create-outline"></ion-icon>
                </span>
            </button></td>
            <td><button type="button" class="btn delete" >
                <span class="button__icon">
                    <ion-icon name="trash-sharp"></ion-icon>
                </span>
            </button></td>
            </tr>`;
  });
    tbody.innerHTML = html;
    load_buttons();
});
