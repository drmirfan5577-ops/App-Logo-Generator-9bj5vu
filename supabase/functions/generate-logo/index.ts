import { createClient } from 'jsr:@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

interface GenerateLogoRequest {
  prompt: string;
  mode: 'text' | 'image' | 'hybrid';
  referenceImage?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    
    // Parse request body
    const { prompt, mode, referenceImage }: GenerateLogoRequest = await req.json();
    
    console.log('Generation request:', { mode, promptLength: prompt.length, hasReference: !!referenceImage });

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get OnSpace AI credentials
    const baseUrl = Deno.env.get('ONSPACE_AI_BASE_URL');
    const apiKey = Deno.env.get('ONSPACE_AI_API_KEY');

    if (!baseUrl || !apiKey) {
      throw new Error('OnSpace AI credentials not configured');
    }

    // Build messages for image generation
    const messages: any[] = [];

    // Construct prompt based on mode
    let fullPrompt = `Create a professional app logo (512x512px) based on: ${prompt}. Design a clean, modern logo suitable for mobile app icons with clear visual elements and good contrast. Focus on visual design only - do not add any text unless specifically requested in the prompt.`;

    if (mode === 'text') {
      messages.push({
        role: 'user',
        content: fullPrompt,
      });
    } else if (mode === 'image' && referenceImage) {
      messages.push({
        role: 'user',
        content: [
          {
            type: 'text',
            text: fullPrompt + ' Use the provided reference image as style inspiration.',
          },
          {
            type: 'image_url',
            image_url: { url: referenceImage },
          },
        ],
      });
    } else if (mode === 'hybrid' && referenceImage) {
      messages.push({
        role: 'user',
        content: [
          {
            type: 'text',
            text: fullPrompt + ' Combine the style and elements from the reference image.',
          },
          {
            type: 'image_url',
            image_url: { url: referenceImage },
          },
        ],
      });
    }

    // Call OnSpace AI image generation API
    console.log('Calling OnSpace AI...');
    const aiResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-3-pro-image-preview',
        messages,
        modalities: ['image', 'text'],
        image_config: {
          aspect_ratio: '1:1',
        },
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('OnSpace AI error:', errorText);
      throw new Error(`OnSpace AI: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    console.log('AI response received');

    // Extract base64 image
    const base64Image = aiData?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!base64Image) {
      throw new Error('No image generated in response');
    }

    // Convert base64 to blob
    const base64Data = base64Image.split(',')[1];
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    const blob = new Blob([binaryData], { type: 'image/png' });

    // Upload to Supabase Storage using Service Role
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    const fileName = `${crypto.randomUUID()}.png`;
    const filePath = `logos/${fileName}`;

    console.log('Uploading to storage:', filePath);
    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(filePath, blob, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('logos')
      .getPublicUrl(filePath);

    console.log('Logo generated successfully:', publicUrl);

    // Get user ID if authenticated
    const token = authHeader?.replace('Bearer ', '');
    let userId = null;
    if (token) {
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Save to database
    const { data: logoRecord, error: dbError } = await supabase
      .from('logos')
      .insert({
        user_id: userId,
        prompt,
        mode,
        image_url: publicUrl,
        reference_image_url: referenceImage || null,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      // Continue even if DB save fails - still return the image
    }

    console.log('Logo record saved to database:', logoRecord?.id);

    return new Response(
      JSON.stringify({ 
        imageUrl: publicUrl,
        logoId: logoRecord?.id || null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-logo:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
