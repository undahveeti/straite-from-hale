(function () {
  var form = document.getElementById("order-form");
  var output = document.getElementById("order-output");

  if (!form) {
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var data = new FormData(form);
    var product = form.getAttribute("data-product-name") || "Product";
    var finish = data.get("finish") || "Not selected";
    var trigger = data.get("trigger") || "Not selected";
    var motion = data.get("motion") || "Not selected";
    var quantity = data.get("quantity") || "1";
    var notes = data.get("notes") || "None";

    var subject = encodeURIComponent("Order Request - " + product);
    var body = encodeURIComponent(
      "Product: " + product + "\n" +
      "Finish: " + finish + "\n" +
      "Trigger Type: " + trigger + "\n" +
      "Motion Package: " + motion + "\n" +
      "Quantity: " + quantity + "\n" +
      "Notes: " + notes + "\n\n" +
      "Please reply with quote, timeline, and payment steps."
    );

    var emailHref = "mailto:Straitetohale@yahoo.com?subject=" + subject + "&body=" + body;

    if (output) {
      output.innerHTML =
        "<p><strong>Great choice.</strong> We built your order draft with all selected options.</p>" +
        "<p><a class=\"btn btn-primary\" href=\"" + emailHref + "\">Open email order draft</a></p>" +
        "<p>You can adjust options above and submit again to regenerate the draft.</p>";
    }
  });
})();
