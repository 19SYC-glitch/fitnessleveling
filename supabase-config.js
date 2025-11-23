// Supabase Configuration
// Replace these values with your Supabase project credentials

const SUPABASE_CONFIG = {
    url: 'https://vpsodiippwabpivlhery.supabase.co', // e.g., 'https://xxxxx.supabase.co'
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwc29kaWlwcHdhYnBpdmxoZXJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4ODk0NjgsImV4cCI6MjA3OTQ2NTQ2OH0.G63l4ZB14DfawWZ3atQ8oXy6Rzveiy0RrDkHIMPexFw' // Your public anon key
};

// Initialize Supabase client
// Note: You'll need to include the Supabase JS library in index.html
// Add this to your HTML: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

let supabaseClient = null;

function initSupabase() {
    if (typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        return supabaseClient;
    } else {
        console.error('Supabase library not loaded. Please include the Supabase JS library.');
        return null;
    }
}

// Get Supabase client instance
function getSupabaseClient() {
    if (!supabaseClient) {
        return initSupabase();
    }
    return supabaseClient;
}

