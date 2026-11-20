
export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const upc = url.searchParams.get("upc") || "";

  if (!/^\d{8,14}$/.test(upc)) {
    return Response.json(
      { error: "Invalid barcode" },
      { status: 400 }
    );
  }

  try {
    const apiUrl =
      "https://api.upcitemdb.com/prod/trial/lookup?upc=" +
      encodeURIComponent(upc);

    const response = await fetch(apiUrl, {
      headers: { Accept: "application/json" }
    });

    const data = await response.json();

    return Response.json(data, {
      status: response.status,
      headers: {
        "Cache-Control": "public, max-age=3600"
      }
    });
  } catch (error) {
    return Response.json(
      { error: "Product lookup unavailable" },
      { status: 502 }
    );
  }
}
