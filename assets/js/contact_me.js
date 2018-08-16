$(function () {
    $("input,textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitSuccess: function ($form, event) {
            event.preventDefault(); 
            var data = getFormData();

            var url = event.target.action;
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange =
                function () {
                    $('#submit-button').hide();
                    $('#success').html("<div class='alert alert-success'>");
                    $('#success > .alert-success').html("<button disabled='' type='button' class='btn btn-callout is-valid'>Message was sent!</button>")
                        .append("</button>");
                    $('#success > .alert-success')
                        .append('</div>');
                    $('#contactForm').trigger("reset");
                    return false;
                };
            var encoded = Object.keys(data).map(function (k) {
                return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
            }).join('&')
            xhr.send(encoded);
        },
        filter: function () {
            return $(this).is(":visible");
        },
    });

    $("a[data-toggle=\"tab\"]").click(function (e) {
        e.preventDefault();
        $(this).tab("show");
    });
});

$('#name').focus(function () {
    $('#success').html('');
});

function getFormData() {
    var form = document.getElementById("contactForm");
    var elements = form.elements; 
    var fields = Object.keys(elements).map(function (k) {
        if (elements[k].name !== undefined) {
            return elements[k].name;
        } else if (elements[k].length > 0) {
            return elements[k].item(0).name;
        }
    }).filter(function (item, pos, self) {
        return self.indexOf(item) == pos && item;
    });
    var data = {};
    fields.forEach(function (k) {
        data[k] = elements[k].value;
        var str = "";
        if (elements[k].type === "checkbox") {
            str = str + elements[k].checked + ", ";
            data[k] = str.slice(0, -2); 
        } else if (elements[k].length) {
            for (var i = 0; i < elements[k].length; i++) {
                if (elements[k].item(i).checked) {
                    str = str + elements[k].item(i).value + ", ";
                    data[k] = str.slice(0, -2);
                }
            }
        }
    });

    fields.push("urlReferrer");
    data.urlReferrer = document.referrer;

    fields.push("ipAddress");
    data.ipAddress = document.ipAddress;

    fields.push("url");
    data.url = document.URL;

    fields.push("userAgent");
    data.userAgent = navigator.userAgent;
    
    data.formDataNameOrder = JSON.stringify(fields);
    data.formGoogleSheetName = form.dataset.sheet || "responses";
    data.formGoogleSendEmail = form.dataset.email || "";

    return data;
}
