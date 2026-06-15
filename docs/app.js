const sampleDeleteUrl = "http://qtivity-backend.example.com:4000/api/calls/Cisco-Guid/fb84cb3c-e20c-46d1-860e-532bea367c72";
const navLinks = Array.from(document.querySelectorAll(".section-nav a"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const searchInput = document.querySelector("#section-search");
const searchStatus = document.querySelector("#search-status");
const sectionSearchIndex = navLinks
  .map((link) => {
    const id = link.getAttribute("href")?.slice(1);
    const section = id ? document.getElementById(id) : null;

    if (!id || !section) return null;

    return {
      id,
      text: `${link.textContent} ${id.replaceAll("-", " ")} ${section.textContent}`.toLowerCase()
    };
  })
  .filter(Boolean);

function setActiveNav(id) {
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
  });
}

function updateSearch(query) {
  const visibleQuery = query.trim();
  const normalizedQuery = visibleQuery.toLowerCase();

  if (!normalizedQuery) {
    navLinks.forEach((link) => link.classList.remove("is-search-hidden"));
    sections.forEach((section) => section.classList.remove("is-search-hidden"));
    searchStatus?.classList.remove("is-visible");
    if (searchStatus) searchStatus.textContent = "";
    return;
  }

  const matches = sectionSearchIndex.filter((section) => section.text.includes(normalizedQuery));
  const matchingIds = new Set(matches.map((section) => section.id));

  navLinks.forEach((link) => {
    const id = link.getAttribute("href")?.slice(1);
    link.classList.toggle("is-search-hidden", !matchingIds.has(id));
  });

  sections.forEach((section) => {
    section.classList.toggle("is-search-hidden", !matchingIds.has(section.id));
  });

  if (searchStatus) {
    const resultLabel = matches.length === 1 ? "result" : "results";
    searchStatus.textContent = matches.length
      ? `${matches.length} ${resultLabel} for "${visibleQuery}".`
      : `No sections found for "${visibleQuery}".`;
    searchStatus.classList.add("is-visible");
  }

  if (!matches.length) return;

  const firstMatch = matches[0].id;
  setActiveNav(firstMatch);
  document.getElementById(firstMatch)?.scrollIntoView({ block: "start" });
  history.replaceState(null, "", `#${firstMatch}`);
}

const snippets = {
  curl: `curl --request DELETE \\
  --url '${sampleDeleteUrl}'`,
  ruby: `require "net/http"

uri = URI("${sampleDeleteUrl}")
request = Net::HTTP::Delete.new(uri)

response = Net::HTTP.start(uri.hostname, uri.port) do |http|
  http.request(request)
end`,
  python: `import requests

response = requests.delete(
    "${sampleDeleteUrl}"
)`,
  php: `<?php
$ch = curl_init("${sampleDeleteUrl}");
curl_setopt_array($ch, [
  CURLOPT_CUSTOMREQUEST => "DELETE",
  CURLOPT_RETURNTRANSFER => true
]);
$response = curl_exec($ch);`,
  java: `HttpRequest request = HttpRequest.newBuilder()
  .uri(URI.create("${sampleDeleteUrl}"))
  .DELETE()
  .build();`,
  node: `const response = await fetch(
  "${sampleDeleteUrl}",
  { method: "DELETE" }
);`,
  go: `req, _ := http.NewRequest(
  "DELETE",
  "${sampleDeleteUrl}",
  nil,
)`,
  dotnet: `using var client = new HttpClient();
using var request = new HttpRequestMessage(
  HttpMethod.Delete,
  "${sampleDeleteUrl}"
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

searchInput?.addEventListener("input", (event) => {
  updateSearch(event.target.value);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
  const activeTag = document.activeElement?.tagName;
  if (activeTag === "INPUT" || activeTag === "TEXTAREA" || activeTag === "SELECT") return;
  event.preventDefault();
  searchInput?.focus();
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
