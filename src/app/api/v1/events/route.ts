
export const POST = async (req: Request) => {
  const headers = req.headers.get("Authorization");
  console.log(headers)
  return new Response(JSON.stringify({hello:"world"}), { status: 200 });
}