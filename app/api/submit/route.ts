import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { name, location, userId } = req.body;
  
    // Validate restaurant location with Google Places API
    const googleApiKey = process.env.GOOGLE_PLACES_API_KEY;
    const googleUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${name} ${location}&inputtype=textquery&fields=formatted_address,name&key=${googleApiKey}`;
  
    const response = await axios.get(googleUrl);
    if (response.data.candidates.length === 0) {
      return res.status(400).json({ error: 'Invalid location' });
    }
  
    // Insert into Supabase
    const { data, error } = await supabase
      .from('restaurants')
      .insert([{ name, location, submitted_by: userId }]);
  
    if (error) {
      return res.status(500).json({ error: error.message });
    }
  
    res.status(200).json({ message: 'Restaurant submitted successfully!' });
  }
