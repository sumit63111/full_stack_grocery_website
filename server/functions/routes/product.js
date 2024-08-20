const router = require("express").Router();
const admin = require("firebase-admin");
const db = admin.firestore();
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const fs = require('fs');
const express=require("express")
let endpointSecret;
// const endpointSecret=process.env.WEBHOOK_SECRET_KEY
db.settings({ ignoreUndefinedProperties: true });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/create", async (req, res) => {
  try {
    const id = Date.now();
    const data = {
      productId: id,
      product_name: req.body.product_name,
      product_category: req.body.product_category,
      product_price: req.body.product_price,
      product_unit:req.body.product_unit,
      imageURL: req.body.imageURL,
    };
    const response = await db.collection("products").doc(`/${id}/`).set(data);
    console.log(response);
    return res.status(200).send({ success: true, data: response });
  } catch (err) {
    return res.send({ success: false, msg: `Error: ${err}` });
  }
});

//GET ALL THE PRODUCTS

router.get("/all", async (req, res) => {
  (async () => {
    try {
      let query = db.collection("products");
      let response = [];
      await query.get().then((querySnap) => {
        let docs = querySnap.docs;
        docs.map((doc) => {
          response.push({ ...doc.data() });
        });
        return response;
      });
      return res.status(200).send({ success: true, data: response });
    } catch (err) {
      return res.send({ success: false, msg: `Error: ${err}` });
    }
  })();
});

//DELETE THE PRODUCTS
router.delete("/delete/:productId", async (req, res) => {
  const productId = req.params.productId;
  try {
    await db
      .collection("products")
      .doc(`/${productId}/`)
      .delete()
      .then((result) => {
        return res.send({ success: true, data: result });
      });
  } catch (err) {
    return res.send({ success: false, msg: `Error: ${err}` });
  }
});

//UPDATE THE PRODUCTS

// Edit a product
router.put("/edit/:productId", async (req, res) => {
  const productId = req.params.productId;
  const updatedProductData = req.body; // New product data to be updated

  try {
    await db
      .collection("products")
      .doc(productId)
      .update(updatedProductData)
      .then((updatedData) => {
        return res.send({ success: true, data: updatedData });
      });
  } catch (err) {
    return res.status(500).send({ success: false, msg: `Error: ${err}` });
  }
});

// ADD TO CART DATABASE
router.post("/addToCart/:userId", async (req, res) => {
  const userId = req.params.userId;
  const productId = req.body.productId;

  try {
    const doc = await db
      .collection("cartItems")
      .doc(`/${userId}/`)
      .collection("items")
      .doc(`/${productId}/`)
      .get();
    if (doc.data()) {
      const product_quantity = doc.data().product_quantity + 1;
      const updateItem = await db
        .collection("cartItems")
        .doc(`/${userId}/`)
        .collection("items")
        .doc(`/${productId}/`)
        .update({ product_quantity });
      return res.status(200).send({ success: true, data: updateItem });
    } else {
      const data = {
        productId: productId,
        product_name: req.body.product_name,
        product_category: req.body.product_category,
        product_price: req.body.product_price,
        imageURL: req.body.imageURL,
        product_quantity: 1,
      };
      const addItems = await db
        .collection("cartItems")
        .doc(`/${userId}/`)
        .collection("items")
        .doc(`/${productId}/`)
        .set(data);
      return res.status(200).send({ success: true, data: addItems });
    }
  } catch (err) {
    return res.send({ success: false, msg: `Error: ${err}` });
  }
});

//DISPLAY THE ITEM IN CART COMPONENT AND FETCH THE DATA FROM DATABASE FOR SPECIFIC USER

router.get("/displayItemsIntoCart/:userId", async (req, res) => {
  (async () => {
    try {
      const userId = req.params.userId;
      let query = await db
        .collection("cartItems")
        .doc(`/${userId}/`)
        .collection("items");
      let response = [];
      await query.get().then((querySnap) => {
        let docs = querySnap.docs;
        docs.map((doc) => {
          response.push({ ...doc.data() });
        });
        return response;
      });
      return res.status(200).send({ success: true, data: response });
    } catch (err) {
      return res.send({ success: false, msg: `Error: ${err}` });
    }
  })();
});

//CLEAR THE CART

router.get("/clear/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const querySnap = await db
      .collection("cartItems")
      .doc(`/${userId}/`)
      .collection("items")
      .get();
    const batch = db.batch();

    querySnap.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    return res
      .status(200)
      .send({ success: true, msg: "Cart cleared successfully" });
  } catch (err) {
    return res.status(500).send({ success: false, msg: `Error: ${err}` });
  }
});

//UPDATE THE CART ITEMS BY INCREMENT AND DECREMENT

router.post("/updateCart/:userId", async (req, res) => {
  const userId = req.params.userId;
  const productId = req.query.productId;
  const type = req.query.type;
  try {
    const doc = await db
      .collection("cartItems")
      .doc(`/${userId}/`)
      .collection("items")
      .doc(`/${productId}/`)
      .get();
    if (doc.data()) {
      if (type === "increment") {
        const product_quantity = doc.data().product_quantity + 1;
        const updateItemByIncrement = await db
          .collection("cartItems")
          .doc(`/${userId}/`)
          .collection("items")
          .doc(`/${productId}/`)
          .update({ product_quantity });
        return res.status(200).send({ success: true, data: updateItemByIncrement });
      } else {
        if (doc.data().product_quantity === 1) {
          await db
            .collection("cartItems")
            .doc(`/${userId}/`)
            .collection("items")
            .doc(`/${productId}/`)
            .delete()
            .then((result) => {
              return res.status(200).send({ success: true, data: result });
            });
        } else {
          const product_quantity = doc.data().product_quantity - 1;
          const updateItemByDecrement = await db
            .collection("cartItems")
            .doc(`/${userId}/`)
            .collection("items")
            .doc(`/${productId}/`)
            .update({ product_quantity });
          return res.status(200).send({ success: true, data: updateItemByDecrement });
        }
      }
    }
  } catch (err) {
    return res.send({ success: false, msg: `Error: ${err}` });
  }
});

// MAKE STRIPE CHECKOUT PAYMENT SESSION

router.post("/create-checkout-session", async (req, res) => {
  const orderItems=[]
  
    req.body.data.cart.map((item)=>{
    orderItems.push({
      
      Price:item.product_price,
      Name:item.product_name,
      Quantity:item.product_quantity,
    })
  })
  const gstAmount = req.body.data.total * 0.18
  const customer =await stripe.customers.create({
    metadata:{
      userId: req.body.data.user.user_id,
      cart:JSON.stringify(orderItems),
      userEmail:req.query.email,
      total:req.body.data.total 
      
    }
  })
  const line_items = req.body.data.cart.map((item) => {
    return {
      price_data: {
        currency: "inr",
        product_data: {
          name: item.product_name,
          images: [item.imageURL],
          metadata: {
            id: item.productId,
          },
        },
        unit_amount: (item.product_price * 100)+(item.product_price * 100)*0.18,
      },
      quantity: item.product_quantity,
    };
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types:["card"],
    shipping_address_collection:{
      allowed_countries:["IN"],
    },
    shipping_options:[
      {
        shipping_rate_data:{
          type:"fixed_amount",
          fixed_amount:{amount:0,currency:"inr"},
          display_name:"Free Shipping",
          delivery_estimate:{
            minimum:{unit:"hour",value:1},
            maximum:{unit:"hour",value:2},
          },
        }
      },
    ],phone_number_collection:{
      enabled:true
    },
    line_items,
    customer:customer.id,
    mode: "payment",
   
    success_url: `${process.env.CLIENT_URL}/payment-success`,
    cancel_url: `${process.env.CLIENT_URL}/`,
  });

  res.send({ url: session.url });
});

//STRIPE LISTEN 

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];

    let eventType;
    let data;

    if (endpointSecret) {
      let event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
      data = event.data.object;
      eventType = event.type;
    } else {
      data = req.body.data.object;
      eventType = req.body.type;
    }

    // Handle the event
    if (eventType === "checkout.session.completed") {
      stripe.customers.retrieve(data.customer).then((customer) => {
        console.log("Customer details", customer);
        console.log("Data", data);
        createOrder(customer, data, res);
      });
    }

    // Return a 200 res to acknowledge receipt of the event
    res.send().end();
  }
);


//CREATE ORDERS
const createOrder = async (customer, intent, res) => {
  console.log("inside the order");
  let totalAmountWithGST=parseFloat(customer.metadata.total) + parseFloat(customer.metadata.total)*0.18
  try {
    const orderId = Date.now();
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1; // Note: getMonth() returns 0-based month
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const data = {
      intendId: intent.id,
      orderId: orderId,
      amount: intent.amount_total,
      created: intent.created,
      payment_method_types: intent.payment_method_types,
      status: intent.status,
      customer: intent.customer,
      shipping_details: intent.shipping_details,
      userId: customer.metadata.userId,
      items: JSON.parse(customer.metadata.cart),
      email:customer.metadata.userEmail,
      phone:customer.phone,
      total: customer.metadata.total,
      totalAmountWithGST: parseFloat(totalAmountWithGST).toFixed(2),
      sts: "preparing",
      Date: `${day}/${month}/${year}`,
      Day:day,
      Month:month,
      Year:year
     
      
    };

    // Save order details to Firebase
    await db.collection("orders").doc(`${orderId}`).set(data);

    // Clear cart after payment completion
    await clearCartAfterPaymentCompletion(customer.metadata.userId);

    // Generate invoice PDF
    const invoicePDF = await generateInvoicePDF(data);

    // Send email with invoice attachment
    await sendInvoiceEmail(customer.email,customer.metadata.userEmail, invoicePDF);

    // Send response to the client
    return res.status(200).send({ success: true, data: data });
  } catch (err) {
    console.error(err);
    // Send error response to the client
    return res.status(500).send({ success: false, msg: `Error: ${err}` });
  }
};


//CREATE INVOICE FOR ORDERS
//******************************************************************************************************************** */
   // Function to generate PDF invoice
  function generateInvoicePDF(invoice) {
    console.log("Inside the invoice order details:", invoice);
    return new Promise((resolve, reject) => {
      let doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffers = [];
  
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
  
   
  
    generateHeader(doc);
    generateCustomerInformation(doc, invoice);
    generateInvoiceTable(doc, invoice);
    generateFooter(doc);
    
     doc.end()                                                                                                                           
    });
    
  }
  
   // Function to generate header
   function generateHeader(doc) {
    doc
      // .image("logo.png", 50, 45, { width: 50 })
      .fillColor("#444444")
      .fontSize(20)
      .text("SASN MART.", 110, 57)
      .fontSize(10)
      .text("SASN MART", 200, 50, { align: "right" })
      .text("Yashasvi Nagar", 200, 65, { align: "right" })
      .text("Thane,MH,400607", 200, 80, { align: "right" })
      .moveDown();
  }
  
  
  // Function to generate customer information
  function generateCustomerInformation(doc, invoice) {
    doc
      .fillColor("#444444")
      .fontSize(20)
      .text("Invoice", 50, 160);
  
    generateHr(doc, 185);
  
    const customerInformationTop = 200;
  
    doc
      .fontSize(10)
      .text("Invoice Number :", 50, customerInformationTop)
      .font("Helvetica-Bold")
      .text(invoice.orderId, 150, customerInformationTop)
      .font("Helvetica")
      .text("Invoice Date :", 50, customerInformationTop + 15)
      .text(formatDate(new Date()), 150, customerInformationTop + 15)
      .text("Total Product:", 50, customerInformationTop + 30)
      .text(invoice.items.length, 150, customerInformationTop + 30)
      .text("Total Amount :", 50, customerInformationTop + 45)
      .text(
        formatCurrency(parseFloat((invoice.amount/100)).toFixed(2)),
        150,
        customerInformationTop + 45
      )
      .text("Payment Mode :", 50, customerInformationTop + 60)
      .text(invoice.payment_method_types, 150, customerInformationTop + 60)
      .text("Payment Status :", 50, customerInformationTop + 75)
      .text(invoice.status, 150, customerInformationTop + 75) 
       

      .font("Helvetica-Bold")
      .text(invoice.shipping_details.name, 300, customerInformationTop)
      .font("Helvetica")
      .text(invoice.shipping_details.address.line1, 300, customerInformationTop + 15)
      .text(
        invoice.shipping_details.address.city +
          ", " +
          invoice.shipping_details.address.state +
          ", " +
          invoice.shipping_details.address.country,
        300,
        customerInformationTop + 45
      )
      .font("Helvetica-Bold")
      .text(invoice.email, 300, customerInformationTop+60)
      .font("Helvetica-Bold")
      .text(invoice.phone, 300, customerInformationTop+75)
      .moveDown();
  
    generateHr(doc, 300);
  }
  
  
  // Function to generate invoice table
  function generateInvoiceTable(doc, invoice) {
    let i;
    const invoiceTableTop = 330;
  
    doc.font("Helvetica-Bold");
    generateTableRow(
      doc,
      invoiceTableTop,
      "Item",
      // "Description",
      "Unit Cost",
      "Quantity",
      "Line Total"
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");
  
    for (i = 0; i < invoice.items.length; i++) {
      const item = invoice.items[i];
      const position = invoiceTableTop + (i + 1) * 30;
      generateTableRow(
        doc,
        position,
        item.Name,
        // item.description,
        formatCurrency(item.Price),
        item.Quantity,
        formatCurrency(item.Price * item.Quantity)
      );
  
      generateHr(doc, position + 20);
    }
    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      subtotalPosition,
      "", 
      "",
      "Sub Total",
      formatCurrency(parseFloat(invoice.total).toFixed(2))
    );
  
    const subtotalPosition1 = invoiceTableTop + (i + 1) * 40;
    generateTableRow(
      doc,
      subtotalPosition+20,
      "", 
      "",
      "CGST",
      formatCurrency(parseFloat((invoice.total)*0.09).toFixed(2))
    );
    const subtotalPosition2 = invoiceTableTop + (i + 1) * 60;
    generateTableRow(
      doc,
      subtotalPosition+40,
      "", 
      "",
      "SGST",
      formatCurrency(parseFloat((invoice.total)*0.09).toFixed(2))
    );

    const subtotalPosition3 = invoiceTableTop + (i + 1) * 70;
    generateTableRow(
      doc,
      subtotalPosition+60,
      "", 
      "",
      "Total GST",
      formatCurrency(parseFloat((invoice.total)*0.18).toFixed(2))
    );
    const subtotalPosition4 = invoiceTableTop + (i + 1) * 80;
    generateTableRow(
      doc,
      subtotalPosition+80,
      "", 
      "",
      "Delivery Charges",
      formatCurrency(parseFloat(0).toFixed(2))
    );
    const subtotalPosition5 = invoiceTableTop + (i + 1) * 90;
    generateTableRow(
      doc,
      subtotalPosition+100,
      "", 
      "",
      "Total Amount",
      formatCurrency(parseFloat((invoice.amount/100)).toFixed(2))
    );
  
    }
  
  
  
  // Function to generate footer
  function generateFooter(doc) {
    doc
      .fontSize(10)
      .text(
        "------------------- THANK YOU ------------------- ",
        50,
        780,
        { align: "center", width: 500 }
      );
  }
  
  // Function to generate table row
  function generateTableRow(
    doc,
    y,
    item,
    // description,
    unitCost,
    quantity,
    lineTotal
  ) {
    doc
      .fontSize(10)
      .text(item, 50, y)
      // .text(description, 150, y)
      .text(unitCost, 280, y, { width: 90, align: "right" })
      .text(quantity, 370, y, { width: 90, align: "right" })
      .text(lineTotal, 0, y, { align: "right" });
  }
  
  // Function to generate horizontal line
  function generateHr(doc, y) {
    doc
      .strokeColor("#aaaaaa")
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  }
  
  // Function to format currency
  function formatCurrency(cents) {
    return "Rs.  " + (cents);
  }
  
  // Function to format date
  function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
  
    return day + " / " + month + " / " + year;
  }
//******************************************************************************************************************** */

// Function to send email with invoice attachment
const sendInvoiceEmail = async (userEmail,userEmail2, invoicePDF) => {
  console.log(invoicePDF)
  try {
   
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    let mailOptions = {
      from: process.env.EMAIL,
      to:[userEmail,userEmail2],
      subject: 'Invoice for Your Order',
      text: 'Please find attached the invoice for your recent order. And your Order procceed successfully',
      attachments: [{
        filename: 'invoice.pdf',
        content: invoicePDF
      }]
    };

    await transporter.sendMail(mailOptions);
    console.log("mail Option : ",mailOptions)
  } catch (error) {
    console.error('Error sending invoice:', error);
  }
};


//CLEAR CART AFTER PAYMENT COMPLETION

const clearCartAfterPaymentCompletion= async (user_id, res) => {
  console.log("inside the delete")
  try {
    const userId = user_id;
    const querySnap = await db
      .collection("cartItems")
      .doc(`/${userId}/`)
      .collection("items")
      .get();
    const batch = db.batch();

    querySnap.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
   
  } catch (err) {
   console.log(err)
  }
};

//GET ALL THE ORDERS

router.get("/order", async (req, res) => {
  (async () => {
    try {
      let query = db.collection("orders");
      let response = [];
      await query.get().then((querySnap) => {
        let docs = querySnap.docs;
        docs.map((doc) => {
          response.push({ ...doc.data() });
        });
        return response;
      });
      return res.status(200).send({ success: true, data: response });
    } catch (err) {
      return res.send({ success: false, msg: `Error: ${err}` });
    }
  })();
});

// UPDATE THE STATUS OF THE ORDERS

router.post("/updateOrderStatus/:orderId", async (req, res) => {
  const orderId = req.params.orderId;
  const sts = req.query.sts;
  const userEmail=req.query.email;
  try {
    const updateOrderStatus=await db.collection("orders").doc(`/${orderId}/`).update({sts})
    if(sts!="preparing"){sendEmailForOrderStatus(userEmail,orderId,sts)}
    return res.status(200).send({success:true,data:updateOrderStatus})
  } catch (err) {
    return res.send({ success: false, msg: `Error: ${err}` });
  }
});

//SEND EMAIL FOR ORDER STATUS
const sendEmailForOrderStatus = async (userEmail,orderId,sts) => {
  
  try {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1; // Note: getMonth() returns 0-based month
    const year = date.getFullYear();
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    let mailOptions = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: `"${orderId}" Order Status`,
      text: `Date : ${day}/${month}/${year}\nOrder Id : ${orderId}\nuser Email : ${userEmail}\n${sts=="delivered" && "Your Order Delivered Successfully" || sts=="shipping" && "Your Order is Dispatched Successfully"}`,
      // attachments: [{
      //   filename: 'invoice.pdf',
      //   content: invoicePDF
      // }]
    };

    await transporter.sendMail(mailOptions);
    console.log("mail Option : ",mailOptions)
  } catch (error) {
    console.error('Error sending invoice:', error);
  }
};



module.exports = router;
