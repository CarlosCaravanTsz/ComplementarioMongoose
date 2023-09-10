// Take Add-To-Cart Buttons

const btnCarts = Array.from(
    document.getElementsByClassName("add_to_cart")
);

btnCarts.forEach((b_add_cart) => {
    b_add_cart.addEventListener('click', async(e) => {
        e.preventDefault();

        let obj = {
          cid: 1, // esto se tomaria de la cookie session
          pid: parseInt(e.target.closest("article").id.slice(5)),
        };

        try {
            const response = await fetch(`/api/carts/${obj.cid}/product/${obj.pid}`, {
                method: "post",
                body: obj,
            });
            alert(`Producto agregado al carrito!`);
            console.log(obj);
        } catch (err) {
            console.error(`Error: ${err}`);
        }
    });
});

