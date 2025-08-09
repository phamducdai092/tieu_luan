import './App.css';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { routes } from './routes';
import { ThemeProvider } from './components/theme/theme-provider';
import { Toaster } from './components/ui/sonner';

function AppRoutes() {
	const element = useRoutes(routes);
	return element;
}

function App() {
	return (
		<BrowserRouter>
			<ThemeProvider defaultTheme="system" storageKey="theme">
				<AppRoutes />
				<Toaster />
			</ThemeProvider>
		</BrowserRouter>
	);
}

export default App;
