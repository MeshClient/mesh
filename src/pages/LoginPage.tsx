import React, {useEffect, useState} from 'react';
import {AnimatePresence, motion, Variants} from 'framer-motion';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {getLoginOptions, login} from '@/api/auth';
import useDebounce from '@/hooks/useDebounce';
import {LoginOption} from '@/types/auth';
import {MeshSpinner} from '@/components/ui/mesh-spinner';

const cardVariants: Variants = {
    hidden: {opacity: 0, y: 30},
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

const formItemVariants: Variants = {
    hidden: {opacity: 0, y: 20},
    visible: (custom: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.3 + custom * 0.1,
            duration: 0.5
        }
    })
};

const DEFAULT_HOMESERVER = 'matrix.org';

const LoginPage: React.FC = () => {
    const [homeserver, setHomeserver] = useState(DEFAULT_HOMESERVER);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginOptions, setLoginOptions] = useState<LoginOption[]>([]);
    const [selectedLoginType, setSelectedLoginType] = useState<string>('m.login.password');
    const [loading, setLoading] = useState(false);
    const [loginStatus, setLoginStatus] = useState<{ success: boolean; message: string } | null>(null);
    const [isValidServer, setIsValidServer] = useState(true);
    const [serverChecking, setServerChecking] = useState(false);

    const debouncedHomeserver = useDebounce(homeserver, 500);

    useEffect(() => {
        const fetchLoginOptions = async () => {
            if (!debouncedHomeserver) return;

            setServerChecking(true);
            const options = await getLoginOptions(debouncedHomeserver);
            setServerChecking(false);

            if (options.length > 0) {
                setLoginOptions(options);
                setIsValidServer(true);
                const passwordLogin = options.find(opt => opt.login_type === 'm.login.password');
                if (passwordLogin) {
                    setSelectedLoginType(passwordLogin.login_type);
                } else {
                    setSelectedLoginType(options[0].login_type);
                }
            } else {
                setLoginOptions([]);
                setIsValidServer(false);
            }
        };

        fetchLoginOptions().then();
    }, [debouncedHomeserver]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setLoginStatus(null);

        try {
            // For now, we just pass homeserver in username format (user@homeserver)
            const formattedUsername = username.includes('@')
                ? username
                : `${username}@${homeserver}`;

            const success = await login(selectedLoginType, formattedUsername, password);

            if (success) {
                setLoginStatus({success: true, message: 'Login successful!'});
                // TODO: Should redirect or update app state here
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                setLoginStatus({success: false, message: 'Login failed. Please check your credentials.'});
            }
        } catch (error) {
            setLoginStatus({success: false, message: 'An error occurred during login.'});
            console.error('Login error details:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <motion.div
                initial="hidden"
                animate="visible"
                className="w-full max-w-md"
            >
                <motion.div variants={cardVariants}>
                    <Card className="overflow-hidden">
                        <CardHeader>
                            <motion.div variants={formItemVariants} custom={0}>
                                <CardTitle className="text-2xl">Welcome to Mesh</CardTitle>
                                <CardDescription>
                                    Sign in to your Matrix account
                                </CardDescription>
                            </motion.div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-4">
                                <motion.div
                                    variants={formItemVariants}
                                    custom={1}
                                    className="space-y-2"
                                >
                                    <Label htmlFor="homeserver">Homeserver</Label>
                                    <div className="relative">
                                        <Input
                                            id="homeserver"
                                            value={homeserver}
                                            onChange={(e) => setHomeserver(e.target.value)}
                                            placeholder="matrix.org"
                                            className={!isValidServer ? "border-red-500" : ""}
                                        />
                                        <AnimatePresence>
                                            {serverChecking && (
                                                <motion.div
                                                    initial={{opacity: 0}}
                                                    animate={{opacity: 1}}
                                                    exit={{opacity: 0}}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                                >
                                                    <MeshSpinner size="sm"/>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    {!isValidServer && (
                                        <motion.p
                                            initial={{opacity: 0, height: 0}}
                                            animate={{opacity: 1, height: 'auto'}}
                                            className="text-sm text-red-500"
                                        >
                                            Invalid homeserver or connection error
                                        </motion.p>
                                    )}
                                </motion.div>

                                <motion.div
                                    variants={formItemVariants}
                                    custom={2}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input
                                            id="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="username"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </motion.div>

                                <AnimatePresence>
                                    {loginStatus && (
                                        <motion.div
                                            initial={{opacity: 0, y: -10}}
                                            animate={{opacity: 1, y: 0}}
                                            exit={{opacity: 0, y: -10}}
                                            className={`p-3 rounded ${
                                                loginStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {loginStatus.message}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <motion.div variants={formItemVariants} custom={4}>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={loading || !isValidServer || !username || !password}
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center">
                        <MeshSpinner size="sm"/>
                      </span>
                                        ) : "Sign In"}
                                    </Button>
                                </motion.div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <motion.p
                                variants={formItemVariants}
                                custom={5}
                                className="text-sm text-muted-foreground"
                            >
                                Don't have an account? Register directly on your homeserver.
                            </motion.p>
                        </CardFooter>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LoginPage;