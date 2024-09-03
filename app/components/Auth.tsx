import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Typography,
    Box
} from '@mui/material';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const Auth: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
    
        try {
          const { data, error } =
            isSignUp
              ? await supabase.auth.signUp({ email, password })
              : await supabase.auth.signInWithPassword({ email, password });
    
          if (error) throw error;
          if (data) {
            onSuccess();
            onClose();
          }
        } catch (error: any) {
          setError(error.message);
        }
      };

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle>{isSignUp ? 'Sign Up' : 'Sign In'}</DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={handleAuth} sx={{ mt: 2 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                    </Button>
                    <Typography align="center">
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                        <Button onClick={() => setIsSignUp(!isSignUp)}>
                            {isSignUp ? 'Sign In' : 'Sign Up'}
                        </Button>
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default Auth;