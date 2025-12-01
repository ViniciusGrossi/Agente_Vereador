import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env.local manually since we are in Node
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseKey = env['VITE_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const customFetch = (url, options) => {
    // 60 seconds timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    return fetch(url, { ...options, signal: controller.signal })
        .then(response => {
            clearTimeout(timeoutId);
            return response;
        })
        .catch(error => {
            clearTimeout(timeoutId);
            throw error;
        });
};

const supabase = createClient(supabaseUrl, supabaseKey, {
    global: {
        fetch: customFetch
    }
});

async function createAdmin() {
    console.log('Creating admin user...');
    const { data, error } = await supabase.auth.signUp({
        email: 'viniciussggrossi@gmail.com',
        password: '02102001Vi',
        options: {
            data: {
                full_name: 'Vinicius Grossi',
            },
        },
    });

    if (error) {
        throw error;
    } else {
        console.log('User created successfully!');
        console.log('Email: viniciussggrossi@gmail.com');
        console.log('Password: 02102001Vi');
        console.log('User ID:', data.user?.id);
        if (data.session) {
            console.log('Session created (Auto-confirm might be on).');
        } else {
            console.log('IMPORTANT: Please check your email to confirm the account.');
        }
    }
}

async function run() {
    const maxRetries = 5;
    for (let i = 0; i < maxRetries; i++) {
        try {
            await createAdmin();
            return;
        } catch (error) {
            console.error(`Attempt ${i + 1}/${maxRetries} failed:`, error.message);
            if (i < maxRetries - 1) {
                console.log('Retrying in 3 seconds...');
                await new Promise(resolve => setTimeout(resolve, 3000));
            } else {
                console.error('All attempts failed.');
            }
        }
    }
}

run();
