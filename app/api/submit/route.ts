import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabaseClient';
import axios from 'axios';

export async function POST(req: Request) {
  const { name, location, userId } = await req.json();

  // Validate restaurant location with Google Places API
  const googleApiKey = process.env.GOOGLE_PLACES_API_KEY;
  const googleUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${name} ${location}&inputtype=textquery&fields=formatted_address,name&key=${googleApiKey}`;

  const response = await axios.get(googleUrl);
  if (response.data.candidates.length === 0) {
    return NextResponse.json({ error: 'Invalid location' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('restaurants')
    .insert([{ name, location, submitted_by: userId }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Restaurant submitted successfully!' }, { status: 200 });
}
