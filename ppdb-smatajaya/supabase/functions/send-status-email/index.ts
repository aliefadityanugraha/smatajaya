import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

interface EmailPayload {
  participant_id: string
  new_status: string
}

const STATUS_EMAILS: Record<string, { subject: string; body: (name: string) => string }> = {
  waiting_verification: {
    subject: "PPDB SMAN 5 Taruna Brawijaya - Pendaftaran Diterima",
    body: (name) => `
      <h2 style="color:#042f1d">Halo, ${name}!</h2>
      <p>Terima kasih telah mendaftar di PPDB SMAN 5 Taruna Brawijaya.</p>
      <p>Pendaftaran Anda telah kami terima dan sedang dalam proses verifikasi oleh tim admin.</p>
      <p>Kami akan menghubungi Anda kembali setelah verifikasi selesai.</p>
      <br/>
      <p>Salam,<br/><strong>PPDB SMAN 5 Taruna Brawijaya</strong></p>
    `,
  },
  verified: {
    subject: "PPDB SMAN 5 Taruna Brawijaya - Pendaftaran Terverifikasi",
    body: (name) => `
      <h2 style="color:#042f1d">Halo, ${name}!</h2>
      <p>Selamat! Pendaftaran Anda telah <strong>berhasil diverifikasi</strong>.</p>
      <p>Anda selangkah lebih dekat untuk menjadi bagian dari SMAN 5 Taruna Brawijaya.</p>
      <p>Silakan cek dashboard Anda untuk informasi lebih lanjut.</p>
      <br/>
      <p>Salam,<br/><strong>PPDB SMAN 5 Taruna Brawijaya</strong></p>
    `,
  },
  needs_revision: {
    subject: "PPDB SMAN 5 Taruna Brawijaya - Perlu Perbaikan Data",
    body: (name) => `
      <h2 style="color:#042f1d">Halo, ${name}!</h2>
      <p>Data pendaftaran Anda memerlukan <strong>perbaikan</strong>.</p>
      <p>Silakan cek dashboard Anda untuk melihat catatan dari admin dan lakukan perbaikan segera.</p>
      <br/>
      <p>Salam,<br/><strong>PPDB SMAN 5 Taruna Brawijaya</strong></p>
    `,
  },
  accepted: {
    subject: "PPDB SMAN 5 Taruna Brawijaya - Masuk Fase Tes",
    body: (name) => `
      <h2 style="color:#042f1d">Halo, ${name}!</h2>
      <p>Selamat! Anda telah <strong>dinyatakan lolos verifikasi</strong> dan masuk ke <strong>Fase Tes</strong>.</p>
      <p>Silakan cek dashboard Anda untuk melihat jadwal tes yang akan dilaksanakan.</p>
      <p>Persiapkan diri Anda dengan baik!</p>
      <br/>
      <p>Salam,<br/><strong>PPDB SMAN 5 Taruna Brawijaya</strong></p>
    `,
  },
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { participant_id, new_status }: EmailPayload = await req.json()

    if (!STATUS_EMAILS[new_status]) {
      return new Response(
        JSON.stringify({ message: `No email template for status: ${new_status}` }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    const { data: participant, error: pError } = await supabase
      .from("participants")
      .select("id, user_id")
      .eq("id", participant_id)
      .single()

    if (pError || !participant) {
      throw new Error("Participant not found")
    }

    const { data: profile, error: prError } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", participant.user_id)
      .single()

    if (prError || !profile?.email) {
      throw new Error("Profile email not found")
    }

    const template = STATUS_EMAILS[new_status]
    const name = profile.full_name || "Peserta"

    if (!RESEND_API_KEY) {
      console.log(`[Email] Would send to ${profile.email}: ${template.subject}`)
      return new Response(
        JSON.stringify({ message: "Email logged (no API key)", to: profile.email }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "PPDB SMAN 5 Taruna Brawijaya <noreply@smatajaya.sch.id>",
        to: [profile.email],
        subject: template.subject,
        html: template.body(name),
      }),
    })

    if (!emailRes.ok) {
      const err = await emailRes.text()
      throw new Error(`Resend API error: ${err}`)
    }

    return new Response(
      JSON.stringify({ message: "Email sent", to: profile.email }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
  catch (error) {
    console.error("[Email Error]", error)
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
