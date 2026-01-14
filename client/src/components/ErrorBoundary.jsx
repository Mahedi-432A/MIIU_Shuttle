import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-red-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
            <h2 className="mb-4 text-2xl font-bold text-red-600">Something went wrong.</h2>
            <div className="p-4 mb-4 overflow-auto text-sm bg-gray-100 rounded max-h-60">
              <p className="font-mono text-red-800 break-words">{this.state.error && this.state.error.toString()}</p>
            </div>
            <p className="mb-4 text-gray-700">Please try refreshing the page or contact support.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 font-bold text-white transition bg-red-600 rounded hover:bg-red-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
