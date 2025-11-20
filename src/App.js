import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, BookOpen, Heart, MessageCircle, Plus, Search, Award, Home, User, Bell, Star, CheckCircle, LogOut, LogIn, X, TrendingUp, Sparkles } from 'lucide-react';

const mockPosts = [
  {
    id: '1',
    type: 'event',
    author: 'María González',
    authorId: 'user1',
    authorCity: 'Madrid',
    avatar: '👵',
    title: 'Clase de Yoga en el Parque',
    description: 'Todos los martes y jueves a las 10:00. ¡Gratis! Traed vuestra esterilla.',
    date: '2025-11-20',
    time: '10:00',
    location: 'Parque del Retiro',
    category: 'Deportivo',
    likes: 23,
    likedBy: [],
    comments: [],
    verified: 3,
    image: '🧘‍♀️',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    type: 'place',
    author: 'Carlos Ruiz',
    authorId: 'user2',
    authorCity: 'Madrid',
    avatar: '👴',
    title: 'Café La Tertulia',
    description: 'Café tranquilo con tertulias literarias los miércoles. Ambiente acogedor y café excelente.',
    location: 'Calle Mayor 45, Madrid',
    category: 'Social',
    rating: 4.5,
    likes: 34,
    likedBy: [],
    comments: [],
    image: '☕',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    type: 'companion',
    author: 'Ana Martín',
    authorId: 'user3',
    authorCity: 'Barcelona',
    avatar: '👵',
    title: 'Busco compañía para ir al teatro',
    description: 'El sábado hay una obra muy buena en el Teatro Español. ¿Alguien se anima?',
    date: '2025-11-23',
    time: '19:00',
    category: 'Cultural',
    likes: 15,
    likedBy: [],
    comments: [],
    image: '🎭',
    createdAt: new Date().toISOString()
  }
];

const categories = ['Todos', 'Cultural', 'Deportivo', 'Social', 'Educativo', 'Ocio'];

const badges = [
  { name: 'Explorador', icon: '🗺️', points: 100, desc: 'Publica 10 lugares' },
  { name: 'Social', icon: '🤝', points: 50, desc: 'Haz 5 amigos' },
  { name: 'Activo', icon: '⚡', points: 200, desc: 'Asiste a 20 eventos' },
  { name: 'Maestro', icon: '📚', points: 150, desc: 'Comparte 10 tutoriales' }
];

function App() {
  const [currentView, setCurrentView] = useState('feed');
  const [posts, setPosts] = useState(mockPosts);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  
  const [user, setUser] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const [userCity, setUserCity] = useState('Madrid');
  const [userStats, setUserStats] = useState({
    posts: 0,
    eventsAttended: 0,
    friends: 0
  });

  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    name: '',
    city: 'Madrid',
    age: ''
  });

  const [newPost, setNewPost] = useState({
    type: 'event',
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Cultural'
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('vivo_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setUserCity(userData.city);
      setUserPoints(userData.points || 0);
      setUserStats(userData.stats || { posts: 0, eventsAttended: 0, friends: 0 });
    }
  }, []);

  useEffect(() => {
    if (user) {
      const userData = {
        ...user,
        points: userPoints,
        stats: userStats,
        city: userCity
      };
      localStorage.setItem('vivo_user', JSON.stringify(userData));
    }
  }, [user, userPoints, userStats, userCity]);

  const filteredPosts = posts.filter(post => {
    const matchCategory = selectedCategory === 'Todos' || post.category === selectedCategory;
    const matchSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       post.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleAuth = () => {
    if (isLogin) {
      if (!authForm.email || !authForm.password) {
        alert('Por favor completa todos los campos');
        return;
      }
      
      const userData = {
        id: 'user_' + Date.now(),
        email: authForm.email,
        name: authForm.email.split('@')[0],
        city: userCity,
        avatar: '😊',
        points: 0,
        stats: { posts: 0, eventsAttended: 0, friends: 0 }
      };
      
      setUser(userData);
      setShowAuth(false);
      alert('¡Bienvenido/a a VIVO! 🎉');
    } else {
      if (!authForm.email || !authForm.password || !authForm.name || !authForm.age) {
        alert('Por favor completa todos los campos');
        return;
      }

      if (parseInt(authForm.age) < 60) {
        alert('VIVO es exclusivo para mayores de 60 años 😊');
        return;
      }

      const userData = {
        id: 'user_' + Date.now(),
        email: authForm.email,
        name: authForm.name,
        city: authForm.city,
        age: authForm.age,
        avatar: '😊',
        points: 100,
        stats: { posts: 0, eventsAttended: 0, friends: 0 }
      };

      setUser(userData);
      setUserCity(userData.city);
      setUserPoints(100);
      setShowAuth(false);
      alert('¡Bienvenido/a a VIVO! Has ganado 100 puntos de bienvenida 🎉');
    }

    setAuthForm({
      email: '',
      password: '',
      name: '',
      city: 'Madrid',
      age: ''
    });
  };

  const handleLogout = () => {
    setUser(null);
    setUserPoints(0);
    setUserStats({ posts: 0, eventsAttended: 0, friends: 0 });
    localStorage.removeItem('vivo_user');
    setCurrentView('feed');
    alert('Has cerrado sesión. ¡Hasta pronto! 👋');
  };

  const handleLike = (postId) => {
    if (!user) {
      alert('Inicia sesión para dar "me gusta" 😊');
      return;
    }

    setPosts(posts.map(post => {
      if (post.id === postId) {
        const liked = post.likedBy?.includes(user.id);
        return {
          ...post,
          likes: liked ? post.likes - 1 : post.likes + 1,
          likedBy: liked 
            ? post.likedBy.filter(id => id !== user.id)
            : [...(post.likedBy || []), user.id]
        };
      }
      return post;
    }));
  };

  const handleNewPost = () => {
    if (!user) {
      alert('Inicia sesión para publicar 😊');
      return;
    }

    if (!newPost.title || !newPost.description) {
      alert('Por favor completa título y descripción');
      return;
    }

    const pointsEarned = newPost.type === 'event' ? 50 : 30;
    
    const post = {
      id: 'post_' + Date.now(),
      ...newPost,
      author: user.name,
      authorId: user.id,
      authorCity: userCity,
      avatar: user.avatar,
      likes: 0,
      likedBy: [],
      comments: [],
      verified: 0,
      image: '✨',
      createdAt: new Date().toISOString()
    };

    setPosts([post, ...posts]);
    setUserPoints(userPoints + pointsEarned);
    setUserStats({
      ...userStats,
      posts: userStats.posts + 1
    });
    
    setNewPost({
      type: 'event',
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      category: 'Cultural'
    });
    
    setShowNewPost(false);
    alert(`¡Publicación creada! Has ganado ${pointsEarned} puntos 🎉`);
  };

  const handleVerify = (postId) => {
    if (!user) {
      alert('Inicia sesión para verificar eventos 😊');
      return;
    }

    setPosts(posts.map(post => 
      post.id === postId ? { ...post, verified: post.verified + 1 } : post
    ));

    setUserPoints(userPoints + 10);
    setUserStats({
      ...userStats,
      eventsAttended: userStats.eventsAttended + 1
    });
  };

  const PostCard = ({ post }) => {
    const getTypeIcon = () => {
      switch(post.type) {
        case 'event': return <Calendar className="w-5 h-5" />;
        case 'place': return <MapPin className="w-5 h-5" />;
        case 'companion': return <Users className="w-5 h-5" />;
        case 'tutorial': return <BookOpen className="w-5 h-5" />;
        default: return <Heart className="w-5 h-5" />;
      }
    };

    const getTypeLabel = () => {
      switch(post.type) {
        case 'event': return 'Evento';
        case 'place': return 'Lugar';
        case 'companion': return 'Busco Compañía';
        case 'tutorial': return 'Tutorial';
        default: return 'Experiencia';
      }
    };

    const getCategoryColor = () => {
      switch(post.category) {
        case 'Cultural': return 'from-purple-400 to-pink-400';
        case 'Deportivo': return 'from-green-400 to-emerald-400';
        case 'Social': return 'from-blue-400 to-cyan-400';
        case 'Educativo': return 'from-yellow-400 to-orange-400';
        case 'Ocio': return 'from-red-400 to-rose-400';
        default: return 'from-gray-400 to-gray-500';
      }
    };

    const isLiked = user && post.likedBy?.includes(user.id);

    return (
      <div className="bg-white rounded-3xl shadow-2xl mb-8 overflow-hidden transform transition-all hover:scale-[1.02] border-4 border-orange-200">
        {/* Header con imagen grande */}
        <div className={`bg-gradient-to-br ${getCategoryColor()} p-8 md:p-10 text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 text-[12rem] opacity-30 animate-pulse">{post.image}</div>
          <div className="absolute bottom-0 left-0 text-7xl opacity-20">✨</div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="text-6xl drop-shadow-lg">{post.avatar}</div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold drop-shadow">{post.author}</p>
                  <p className="text-lg md:text-xl opacity-90">{post.authorCity}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm px-5 py-3 rounded-full shadow-lg">
                {getTypeIcon()}
                <span className="text-base md:text-lg font-bold">{getTypeLabel()}</span>
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow-lg leading-tight">{post.title}</h3>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 md:p-8">
          <p className="text-2xl md:text-3xl text-gray-700 mb-8 leading-relaxed font-medium">{post.description}</p>

          {/* Detalles */}
          <div className="space-y-4 mb-8">
            {post.date && (
              <div className="flex items-center gap-4 text-xl md:text-2xl text-gray-700 bg-gradient-to-r from-orange-100 to-orange-200 p-5 rounded-3xl shadow-md border-2 border-orange-300">
                <Calendar className="w-8 h-8 text-orange-600" />
                <span className="font-bold">{post.date} {post.time && `· ${post.time}`}</span>
              </div>
            )}
            {post.location && (
              <div className="flex items-center gap-4 text-xl md:text-2xl text-gray-700 bg-gradient-to-r from-green-100 to-green-200 p-5 rounded-3xl shadow-md border-2 border-green-300">
                <MapPin className="w-8 h-8 text-green-600" />
                <span className="font-bold">{post.location}</span>
              </div>
            )}
            {post.rating && (
              <div className="flex items-center gap-4 text-xl md:text-2xl text-gray-700 bg-gradient-to-r from-yellow-100 to-yellow-200 p-5 rounded-3xl shadow-md border-2 border-yellow-300">
                <Star className="w-8 h-8 fill-yellow-400 text-yellow-600" />
                <span className="font-bold">{post.rating} / 5 estrellas</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className={`inline-block bg-gradient-to-r ${getCategoryColor()} text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg`}>
              {post.category}
            </span>
            {post.verified > 0 && (
              <div className="flex items-center gap-2 bg-green-100 px-5 py-3 rounded-full">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-lg text-green-700 font-bold">{post.verified} ✓</span>
              </div>
            )}
          </div>

          {/* Botones de interacción */}
          <div className="flex gap-4 md:gap-6 pt-8 border-t-4 border-orange-100">
            <button 
              onClick={() => handleLike(post.id)}
              className={`flex-1 flex items-center justify-center gap-3 py-6 md:py-7 rounded-3xl text-2xl md:text-3xl font-bold transition-all shadow-lg ${
                isLiked 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-2xl scale-105' 
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-red-400 hover:to-pink-400 hover:text-white hover:scale-105 border-3 border-gray-300'
              }`}
            >
              <Heart className={`w-9 h-9 md:w-10 md:h-10 ${isLiked ? 'fill-white' : ''}`} />
              <span>{post.likes}</span>
            </button>
            <button 
              onClick={() => handleVerify(post.id)}
              className="flex-1 flex items-center justify-center gap-3 py-6 md:py-7 rounded-3xl text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:scale-105 hover:shadow-2xl"
            >
              <CheckCircle className="w-9 h-9 md:w-10 md:h-10" />
              <span>¡Yo fui!</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const FeedView = () => (
    <div className="px-2">
      {!user && (
        <div className="bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 rounded-3xl shadow-2xl p-8 md:p-10 mb-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 text-9xl opacity-30 animate-bounce">🌟</div>
          <div className="absolute bottom-0 left-0 text-7xl opacity-20">✨</div>
          <div className="relative z-10">
            <Sparkles className="w-24 h-24 mx-auto mb-6 animate-pulse drop-shadow-lg" />
            <h2 className="text-4xl md:text-5xl font-bold mb-5 drop-shadow-lg">¡Bienvenido/a a VIVO!</h2>
            <p className="text-2xl md:text-3xl mb-8 leading-relaxed font-semibold">La red social donde los jubilados nunca se aburren</p>
            <button
              onClick={() => setShowAuth(true)}
              className="bg-white text-orange-600 px-12 py-6 rounded-full text-2xl md:text-3xl font-bold hover:bg-orange-50 transition-all shadow-2xl transform hover:scale-105"
            >
              🎉 Unirse Gratis
            </button>
          </div>
        </div>
      )}

      {/* Buscador y filtros */}
      <div className="bg-gradient-to-br from-white to-orange-50 rounded-3xl shadow-xl p-6 md:p-8 mb-8 border-4 border-orange-200">
        <div className="relative mb-6">
          <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-orange-500 w-8 h-8" />
          <input
            type="text"
            placeholder="🔍 Buscar eventos, lugares..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-20 pr-6 py-7 text-2xl border-4 border-orange-300 rounded-3xl focus:border-orange-500 focus:outline-none bg-white shadow-inner"
          />
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-8 py-5 rounded-2xl text-xl md:text-2xl font-bold whitespace-nowrap transition-all shadow-lg ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white scale-110 shadow-xl'
                  : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-orange-100 hover:to-red-100 hover:text-orange-600 border-3 border-orange-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      {filteredPosts.length === 0 ? (
        <div className="bg-gradient-to-br from-white to-orange-100 rounded-3xl shadow-2xl p-16 md:p-20 text-center border-4 border-orange-200">
          <div className="text-9xl mb-8 animate-bounce">😔</div>
          <p className="text-3xl md:text-4xl text-gray-700 mb-6 font-bold">No hay publicaciones</p>
          <p className="text-2xl md:text-3xl text-gray-500 font-semibold">¡Sé el primero en publicar algo!</p>
        </div>
      ) : (
        filteredPosts.map(post => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );

  const ProfileView = () => {
    if (!user) {
      return (
        <div className="bg-white rounded-3xl shadow-xl p-16 text-center">
          <User className="w-32 h-32 mx-auto mb-8 text-gray-300" />
          <h2 className="text-4xl font-bold mb-6">Inicia sesión para ver tu perfil</h2>
          <button
            onClick={() => setShowAuth(true)}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-12 py-6 rounded-full text-2xl font-bold hover:from-orange-600 hover:to-red-600 transition-all shadow-xl"
          >
            Iniciar Sesión
          </button>
        </div>
      );
    }

    return (
      <div>
        {/* Perfil header */}
        <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-3xl shadow-2xl p-10 mb-8 text-white">
          <div className="text-8xl mb-6 text-center">{user.avatar}</div>
          <h2 className="text-4xl font-bold text-center mb-3">{user.name}</h2>
          <p className="text-2xl text-center opacity-90 mb-2">{userCity}</p>
          {user.age && (
            <p className="text-xl text-center opacity-80">{user.age} años</p>
          )}
          
          {/* Puntos */}
          <div className="mt-8 bg-white/20 backdrop-blur-sm rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Star className="w-10 h-10 fill-white" />
                <span className="text-2xl font-semibold">Mis Puntos</span>
              </div>
              <span className="text-5xl font-bold">{userPoints}</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-6 overflow-hidden">
              <div 
                className="bg-white h-6 rounded-full transition-all duration-500"
                style={{ width: `${(userPoints % 100)}%` }}
              ></div>
            </div>
            <p className="text-xl mt-4 opacity-90 text-center">
              {100 - (userPoints % 100)} puntos para la siguiente insignia
            </p>
          </div>
        </div>

        {/* Insignias */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-2 border-orange-100">
          <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Award className="w-10 h-10 text-yellow-500" />
            Mis Insignias
          </h3>
          <div className="grid grid-cols-2 gap-6">
            {badges.map((badge, index) => (
              <div 
                key={index}
                className={`p-8 rounded-2xl text-center transition-all ${
                  userPoints >= badge.points
                    ? 'bg-gradient-to-br from-yellow-200 to-orange-200 border-4 border-yellow-400 shadow-xl scale-105'
                    : 'bg-gray-100 opacity-50'
                }`}
              >
                <div className="text-6xl mb-4">{badge.icon}</div>
                <p className="text-2xl font-bold text-gray-800 mb-2">{badge.name}</p>
                <p className="text-lg text-gray-600 mb-2">{badge.desc}</p>
                <p className="text-xl text-gray-600 font-semibold">{badge.points} pts</p>
                {userPoints >= badge.points && (
                  <p className="text-lg text-green-600 font-bold mt-3">✅ ¡Conseguida!</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Estadísticas */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-2 border-orange-100">
          <h3 className="text-3xl font-bold mb-6">📊 Mis Estadísticas</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center text-2xl bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl">
              <span className="text-gray-700 font-semibold">📝 Publicaciones:</span>
              <span className="font-bold text-3xl text-blue-600">{userStats.posts}</span>
            </div>
            <div className="flex justify-between items-center text-2xl bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl">
              <span className="text-gray-700 font-semibold">🎉 Eventos:</span>
              <span className="font-bold text-3xl text-green-600">{userStats.eventsAttended}</span>
            </div>
            <div className="flex justify-between items-center text-2xl bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl">
              <span className="text-gray-700 font-semibold">👥 Amigos:</span>
              <span className="font-bold text-3xl text-purple-600">{userStats.friends}</span>
            </div>
          </div>
        </div>

        {/* Botón cerrar sesión */}
        <button
          onClick={handleLogout}
          className="w-full bg-gradient-to-r from-red-500 to-rose-500 text-white px-8 py-6 rounded-2xl text-2xl font-bold hover:from-red-600 hover:to-rose-600 transition-all shadow-xl flex items-center justify-center gap-4"
        >
          <LogOut className="w-8 h-8" />
          Cerrar Sesión
        </button>
      </div>
    );
  };

  const AuthModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-10 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
            {isLogin ? '👋 Bienvenido' : '🎉 Únete'}
          </h2>
          <button onClick={() => setShowAuth(false)} className="text-gray-500 hover:text-gray-700">
            <X className="w-10 h-10" />
          </button>
        </div>

        <div className="space-y-6">
          {!isLogin && (
            <>
              <div>
                <label className="block text-2xl font-bold mb-3 text-gray-700">Nombre completo</label>
                <input
                  type="text"
                  value={authForm.name}
                  onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                  placeholder="Tu nombre"
                  className="w-full p-5 text-2xl border-3 border-gray-200 rounded-2xl focus:border-orange-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-2xl font-bold mb-3 text-gray-700">Edad</label>
                <input
                  type="number"
                  value={authForm.age}
                  onChange={(e) => setAuthForm({...authForm, age: e.target.value})}
                  placeholder="Mayor de 60"
                  className="w-full p-5 text-2xl border-3 border-gray-200 rounded-2xl focus:border-orange-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-2xl font-bold mb-3 text-gray-700">Ciudad</label>
                <select
                  value={authForm.city}
                  onChange={(e) => setAuthForm({...authForm, city: e.target.value})}
                  className="w-full p-5 text-2xl border-3 border-gray-200 rounded-2xl focus:border-orange-400 focus:outline-none"
                >
                  <option>Madrid</option>
                  <option>Barcelona</option>
                  <option>Valencia</option>
                  <option>Sevilla</option>
                  <option>Zaragoza</option>
                  <option>Málaga</option>
                  <option>Bilbao</option>
                  <option>Zamora</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-2xl font-bold mb-3 text-gray-700">Email</label>
            <input
              type="email"
              value={authForm.email}
              onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
              placeholder="tu@email.com"
              className="w-full p-5 text-2xl border-3 border-gray-200 rounded-2xl focus:border-orange-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-2xl font-bold mb-3 text-gray-700">Contraseña</label>
            <input
              type="password"
              value={authForm.password}
              onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
              placeholder="••••••••"
              className="w-full p-5 text-2xl border-3 border-gray-200 rounded-2xl focus:border-orange-400 focus:outline-none"
            />
          </div>

          <button
            onClick={handleAuth}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-6 rounded-2xl text-2xl font-bold hover:from-orange-600 hover:to-red-600 transition-all shadow-xl"
          >
            {isLogin ? '🚀 Entrar' : '🎉 Registrarse'}
          </button>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-orange-500 text-xl hover:underline font-semibold"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  );

  const NewPostModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
            ✨ Nueva Publicación
          </h2>
          <button onClick={() => setShowNewPost(false)} className="text-gray-500 hover:text-gray-700">
            <X className="w-10 h-10" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-2xl font-bold mb-3 text-gray-700">Tipo</label>
            <select
              value={newPost.type}
              onChange={(e) => setNewPost({...newPost, type: e.target.value})}
              className="w-full p-5 text-2xl border-3 border-gray-200 rounded-2xl focus:border-orange-400 focus:outline-none"
            >
              <option value="event">🎉 Evento</option>
              <option value="place">📍 Lugar</option>
              <option value="companion">👥 Busco Compañía</option>
              <option value="tutorial">📚 Tutorial</option>
            </select>
          </div>

          <div>
            <label className="block text-2xl font-bold mb-3 text-gray-700">Título</label>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              placeholder="Ej: Clase de Yoga"
              className="w-full p-5 text-2xl border-3 border-gray-200 rounded-2xl focus:border-orange-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-2xl font-bold mb-3 text-gray-700">Descripción</label>
            <textarea
              value={newPost.description}
              onChange={(e) => setNewPost({...newPost, description: e.target.value})}
              placeholder="Cuenta los detalles..."
              rows="4"
              className="w-full p-5 text-2xl border-3 border-gray-200 rounded-2xl focus:border-orange-400 focus:outline-none"
            />
          </div>

          {(newPost.type === 'event' || newPost.type === 'companion') && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-2xl font-bold mb-3 text-gray-700">Fecha</label>
                <input
                  type="date"
                  value={newPost.date}
                  onChange={(e) => setNewPost({...newPost, date: e.target.value})}
                  className="w-full p-5 text-2xl border-3 border-gray-200 rounded-2xl focus:border-orange-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-2xl font-bold mb-3 text-gray-700">Hora</label>
                <input
                  type="time"
                  value={newPost.time}
                  onChange={(e) => setNewPost({...newPost, time: e.target.value})}
                  className="w-full p-5 text-2xl border-3 border-gray-200 rounded-2xl focus:border-orange-400 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-2xl font-bold mb-3 text-gray-700">Ubicación</label>
            <input
              type="text"
              value={newPost.location}
              onChange={(e) => setNewPost({...newPost, location: e.target.value})}
              placeholder="Ej: Parque del Retiro"
              className="w-full p-5 text-2xl border-3 border-gray-200 rounded-2xl focus:border-orange-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-2xl font-bold mb-3 text-gray-700">Categoría</label>
            <select
              value={newPost.category}
              onChange={(e) => setNewPost({...newPost, category: e.target.value})}
              className="w-full p-5 text-2xl border-3 border-gray-200 rounded-2xl focus:border-orange-400 focus:outline-none"
            >
              <option value="Cultural">Cultural</option>
              <option value="Deportivo">Deportivo</option>
              <option value="Social">Social</option>
              <option value="Educativo">Educativo</option>
              <option value="Ocio">Ocio</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setShowNewPost(false)}
              className="flex-1 px-8 py-5 bg-gray-200 text-gray-700 rounded-2xl text-2xl font-bold hover:bg-gray-300 transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleNewPost}
              className="flex-1 px-8 py-5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl text-2xl font-bold hover:from-orange-600 hover:to-red-600 transition-all shadow-xl"
            >
              Publicar 🎉
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-red-100 to-pink-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 shadow-2xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl animate-pulse">🌟</div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                  VIVO
                </h1>
                <p className="text-lg md:text-xl text-white/90 font-semibold">Nunca dejes de vivir</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {user && (
                <div className="hidden md:flex items-center gap-3 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-full">
                  <Star className="w-7 h-7 text-yellow-300 fill-yellow-300" />
                  <span className="text-2xl font-bold text-white">{userPoints}</span>
                </div>
              )}
              {user ? (
                <button className="p-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full relative transition-all">
                  <Bell className="w-8 h-8 text-white" />
                  <span className="absolute top-3 right-3 w-4 h-4 bg-yellow-400 rounded-full"></span>
                </button>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="flex items-center gap-3 bg-white text-orange-600 px-8 py-4 rounded-full text-xl font-bold hover:bg-orange-50 transition-all shadow-xl"
                >
                  <LogIn className="w-7 h-7" />
                  Entrar
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-8 pb-32 md:pb-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar - Desktop only */}
          <div className="hidden md:block">
            <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-28 border-2 border-orange-100">
              <nav className="space-y-4">
                <button
                  onClick={() => setCurrentView('feed')}
                  className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl text-2xl font-bold transition-all ${
                    currentView === 'feed'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-orange-50'
                  }`}
                >
                  <Home className="w-7 h-7" />
                  Inicio
                </button>
                <button
                  onClick={() => setCurrentView('profile')}
                  className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl text-2xl font-bold transition-all ${
                    currentView === 'profile'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-orange-50'
                  }`}
                >
                  <User className="w-7 h-7" />
                  Mi Perfil
                </button>
                <button
                  onClick={() => setCurrentView('calendar')}
                  className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl text-2xl font-bold transition-all ${
                    currentView === 'calendar'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-orange-50'
                  }`}
                >
                  <Calendar className="w-7 h-7" />
                  Mi Agenda
                </button>
              </nav>

              {user && (
                <div className="mt-8 pt-8 border-t-2 border-gray-100">
                  <p className="text-xl text-gray-600 mb-4 font-semibold">Tu ciudad:</p>
                  <select
                    value={userCity}
                    onChange={(e) => setUserCity(e.target.value)}
                    className="w-full p-4 text-xl border-3 border-gray-200 rounded-2xl focus:border-orange-400 focus:outline-none"
                  >
                    <option>Madrid</option>
                    <option>Barcelona</option>
                    <option>Valencia</option>
                    <option>Sevilla</option>
                    <option>Zaragoza</option>
                    <option>Málaga</option>
                    <option>Bilbao</option>
                    <option>Zamora</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Content area */}
          <div className="md:col-span-2">
            {currentView === 'feed' && <FeedView />}
            {currentView === 'profile' && <ProfileView />}
            {currentView === 'calendar' && (
              <div className="bg-white rounded-3xl shadow-xl p-12 text-center border-2 border-orange-100">
                <Calendar className="w-32 h-32 mx-auto mb-8 text-orange-500" />
                <h2 className="text-4xl font-bold mb-4">Mi Agenda</h2>
                <p className="text-2xl text-gray-600">Próximamente: Calendario personalizado con todos tus eventos</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Botón flotante para crear publicación */}
      {user && (
        <button
          onClick={() => setShowNewPost(true)}
          className="fixed bottom-32 md:bottom-10 right-6 md:right-8 bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-8 md:p-10 rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110 z-30 animate-bounce border-4 border-white"
        >
          <Plus className="w-12 h-12 md:w-14 md:h-14" />
        </button>
      )}

      {/* Menú inferior - Mobile only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 px-4 py-5 z-40 shadow-2xl border-t-4 border-orange-600">
        <div className="flex justify-around items-center">
          <button
            onClick={() => setCurrentView('feed')}
            className={`flex flex-col items-center gap-2 ${
              currentView === 'feed' ? 'text-white scale-110' : 'text-white/70'
            }`}
          >
            <Home className="w-10 h-10 drop-shadow-lg" />
            <span className="text-base font-bold drop-shadow">Inicio</span>
          </button>
          <button
            onClick={() => setCurrentView('calendar')}
            className={`flex flex-col items-center gap-2 ${
              currentView === 'calendar' ? 'text-white scale-110' : 'text-white/70'
            }`}
          >
            <Calendar className="w-10 h-10 drop-shadow-lg" />
            <span className="text-base font-bold drop-shadow">Agenda</span>
          </button>
          {user && (
            <button
              onClick={() => setShowNewPost(true)}
              className="flex flex-col items-center gap-2"
            >
              <div className="bg-yellow-400 text-orange-600 p-5 rounded-full -mt-12 shadow-2xl border-4 border-white animate-pulse">
                <Plus className="w-10 h-10" />
              </div>
              <span className="text-base font-bold text-white drop-shadow">Publicar</span>
            </button>
          )}
          <button
            onClick={() => setCurrentView('profile')}
            className={`flex flex-col items-center gap-2 ${
              currentView === 'profile' ? 'text-white scale-110' : 'text-white/70'
            }`}
          >
            <User className="w-10 h-10 drop-shadow-lg" />
            <span className="text-base font-bold drop-shadow">Perfil</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      {showNewPost && <NewPostModal />}
      {showAuth && <AuthModal />}
    </div>
  );
}

export default App;
