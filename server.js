import { serve } from "bun";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

serve({
  port: PORT,
  async fetch(request) {
    // POST /echo
    if (request.method === "POST" && request.url.endsWith("/echo")) {
      const data = await request.json();
      return new Response(JSON.stringify({ youSent: data }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // GET / → HTML сторінка
    return new Response(
      `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Bun Render Example</title>
      </head>
      <body>
        <h1>Hello from Bun on Render!</h1>
        <form id="echoForm">
          <input type="text" id="name" placeholder="Name" />
          <input type="number" id="value" placeholder="Value" />
          <button type="submit">Send</button>
        </form>
        <pre id="result"></pre>
        <script>
          const form = document.getElementById("echoForm");
          form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const value = Number(document.getElementById("value").value);
            const res = await fetch('/echo', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name, value })
            });
            const data = await res.json();
            document.getElementById("result").textContent = JSON.stringify(data, null, 2);
          });
        </script>
      </body>
      </html>
      `,
      { headers: { "Content-Type": "text/html" } }
    );
  },
});