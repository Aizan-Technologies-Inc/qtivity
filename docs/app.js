const snippets = {
  curl: `curl --request DELETE \\
  --url 'http://127.0.0.1:4000/api/calls/Cisco-Guid/fb84cb3c-e20c-46d1-860e-532bea367c72'`,
  ruby: `require "net/http"

uri = URI("http://127.0.0.1:4000/api/calls/Cisco-Guid/fb84cb3c-e20c-46d1-860e-532bea367c72")
request = Net::HTTP::Delete.new(uri)

response = Net::HTTP.start(uri.hostname, uri.port) do |http|
  http.request(request)
end`,
  python: `import requests

response = requests.delete(
    "http://127.0.0.1:4000/api/calls/Cisco-Guid/fb84cb3c-e20c-46d1-860e-532bea367c72"
)`,
  php: `<?php
$ch = curl_init("http://127.0.0.1:4000/api/calls/Cisco-Guid/fb84cb3c-e20c-46d1-860e-532bea367c72");
curl_setopt_array($ch, [
  CURLOPT_CUSTOMREQUEST => "DELETE",
  CURLOPT_RETURNTRANSFER => true
]);
$response = curl_exec($ch);`,
  java: `HttpRequest request = HttpRequest.newBuilder()
  .uri(URI.create("http://127.0.0.1:4000/api/calls/Cisco-Guid/fb84cb3c-e20c-46d1-860e-532bea367c72"))
  .DELETE()
  .build();`,
  node: `const response = await fetch(
  "http://127.0.0.1:4000/api/calls/Cisco-Guid/fb84cb3c-e20c-46d1-860e-532bea367c72",
  { method: "DELETE" }
);`,
  go: `req, _ := http.NewRequest(
  "DELETE",
  "http://127.0.0.1:4000/api/calls/Cisco-Guid/fb84cb3c-e20c-46d1-860e-532bea367c72",
  nil,
)`,
  dotnet: `using var client = new HttpClient();
using var request = new HttpRequestMessage(
  HttpMethod.Delete,
  "http://127.0.0.1:4000/api/calls/Cisco-Guid/fb84cb3c-e20c-46d1-860e-532bea367c72"
);
using var response = await client.SendAsync(request);`
};

const responses = {
  200: `{
  "success": true
}`,
  404: `{
  "message": "Channel not found"
}`
};

document.querySelector("#section-search").addEventListener("input", (event) => {
  const query = event.target.value.trim().toLowerCase();
  document.querySelectorAll(".section-nav a").forEach((link) => {
    link.hidden = query && !link.textContent.toLowerCase().includes(query);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
  const activeTag = document.activeElement?.tagName;
  if (activeTag === "INPUT" || activeTag === "TEXTAREA" || activeTag === "SELECT") return;
  event.preventDefault();
  document.querySelector("#section-search").focus();
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.getElementById(button.dataset.copy);
    if (!target) return;

    const originalLabel = button.textContent;
    try {
      await navigator.clipboard.writeText(target.textContent);
      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = originalLabel;
      }, 1100);
    } catch {
      const range = document.createRange();
      range.selectNodeContents(target);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });
});

function setLanguage(language) {
  document.querySelector("#delete-call-request").textContent = snippets[language];
  document.querySelector('[data-language-select="delete-call"]').value = language;
}

function setResponse(code) {
  document.querySelector("#delete-call-response").textContent = responses[code];
  document.querySelectorAll("[data-response-tab]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.responseCode === String(code));
  });
}

document.querySelector('[data-language-select="delete-call"]').addEventListener("change", (event) => {
  setLanguage(event.target.value);
});

document.querySelectorAll("[data-response-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    setResponse(button.dataset.responseCode);
  });
});

setLanguage("curl");
setResponse("200");
