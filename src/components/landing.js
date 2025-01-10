import { useNavigate } from "react-router";

const Landing = () => {

  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleSignIn = () => {
    navigate("/signin");
  };

    return (
        <div className="min-h-screen flex">
      <div className="w-1/2 flex flex-col">
        <header className="px-8 pt-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">           
              <span className="text-5xl font-semibold">Seek</span>
            </div>
            <button onClick={handleSignIn} className="px-6 py-3 bg-white text-gray-800 border border-gray-300 rounded-full hover:bg-gray-100 transition duration-300">
                Log In
              </button>
          </nav>
        </header>

        <main className="flex-grow flex items-center px-8">
          <div className="space-y-8 max-w-xl">
            <div className="text-blue-600 font-semibold tracking-wide">
              FASTER MORE INTEGRATED
            </div>
            <h1 className="text-6xl font-bold space-y-2">
              <div>Empower</div>
              <div>Connections</div>
              <div className="bg-gradient-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text">
                Zero Friction
              </div>
            </h1>
            <p className="text-xl text-gray-600">
              Enable digital ecosystem for attractive meeting services, built on a verified digital identity platform
            </p>
            <div className="flex space-x-4">
              <button onClick={handleSignUp} className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300">
                Start For Free
              </button>
            </div>
          </div>
        </main>
      </div>

      <div className="w-1/2 bg-gradient-to-br from-blue-500 via-purple-200 to-pink-300 flex items-center justify-center p-8">
        <img src="dalle.webp"/>
      </div>
    </div>
      );
};


export default Landing