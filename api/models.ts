export const config = { runtime: 'edge' }
declare const process: { env: Record<string, string | undefined> }

export default async function handler(): Promise<Response> {
  const key = process.env.GEMINI_API_KEY ?? ''
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
  )
  const data = await res.json() as { models?: { name: string; supportedGenerationMethods?: string[] }[] }
  const nomes = (data.models ?? [])
    .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
    .map(m => m.name)
  return Response.json({ modelos_disponiveis: nomes })
}
