import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, SafeAreaView, TextInput, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import PlaylistDetail from './PlaylistDetail.js';
import userAudios from './UserAudio.js'; // Ajusta la ruta según tu estructura


// Poster por defecto
const posterDefault = require('../assets/logoB.png');

const tracksOriginales = [
  {
    id: 1,
    title: "Fidelio, Op. 72 - Part 4",
    artist: "Beethoven",
    genre: "Clásica",
    uri: require('../assets/audios/audio1.mp3'),
  },
  {
    id: 2,
    title: "Moonlight Sonata Op. 27 No. 2 - II. Allegretto",
    artist: "Beethoven",
    genre: "Clásica",
    uri: require('../assets/audios/audio2.mp3'),
  },
  {
    id: 3,
    title: "El Danubio Azul",
    artist: "Johann Strauss",
    genre: "Clásica",
    uri: require('../assets/audios/audio3.mp3'),
  },
  {
    id: 4,
    title: "Piano Sonata no. 15 in D 'Pastoral', Op. 28 - I. Allegro",
    artist: "Beethoven",
    genre: "Clásica",
    uri: require('../assets/audios/audio4.mp3'),
  },
  {
    id: 5,
    title: "Symphony No. 6 in F Major 'Pastoral', Op. 68 - IV. Allegro",
    artist: "Beethoven",
    genre: "Clásica",
    uri: require('../assets/audios/audio5.mp3'),
  }
];

const ListaMusica = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState(true);
  const [isPlayerBarVisible, setIsPlayerBarVisible] = useState(true); 
  const [showCreateMenu, setShowCreateMenu] = useState(false); 
  const [userAudiosAdded, setUserAudiosAdded] = useState(false); 
   const [tracks, setTracks] = useState([...tracksOriginales]); 
  const [activeSection, setActiveSection] = useState('home'); 
  const soundRef = useRef(new Audio.Sound());

  // Filtrar canciones basado en la búsqueda
  const filteredTracks = useMemo(() => {
  
   if (!searchTerm) return tracks;
    
    const lowerCaseSearch = searchTerm.toLowerCase();
    return tracks.filter(track => 
      track.title.toLowerCase().includes(lowerCaseSearch) ||
      track.artist.toLowerCase().includes(lowerCaseSearch) ||
      track.genre.toLowerCase().includes(lowerCaseSearch)
    );
  }, [searchTerm]);


const ListaMusica = () => {
  const [tracks, setTracks] = useState([...tracksOriginales]); // Estado modificable
  const [userAudiosAdded, setUserAudiosAdded] = useState(false);

};
const agregarAudiosUsuario = () => {
  if (!userAudiosAdded) {
    setTracks([...tracks, ...userAudios]); // Combina audios
    setUserAudiosAdded(true);
    alert("Audios agregados a la lista");
  }
};

  // Cargar y reproducir
  const playTrack = async (track) => {
    try {
      await soundRef.current.unloadAsync();
      await soundRef.current.loadAsync(track.uri);
      
      await soundRef.current.playAsync();
      setCurrentTrack(track);
      setIsPlaying(true);

      soundRef.current.setOnPlaybackStatusUpdate(status => {
        if (status.didJustFinish) playNextTrack();
      });

    } catch (error) {
      console.log('Error al reproducir:', error);
    }
  };

  // Pausar/Reanudar
  const togglePlayPause = async () => {
    if (!soundRef.current) return;
    
    if (isPlaying) {
      await soundRef.current.pauseAsync();
    } else {
      await soundRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  // Siguiente canción
  const playNextTrack = () => {
    if (!currentTrack) return;
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    playTrack(tracks[nextIndex]);
  };

  // Limpieza
 useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

useEffect(() => {
  if (currentTrack) {
    const favoritos = playlists.find(p => p.name === "Favoritos");
    if (favoritos) {
      const esFavorito = favoritos.tracks.some(track => track.id === currentTrack.id);
      setIsFavorite(esFavorito);
    } else {
      setIsFavorite(false);
    }
  }
}, [currentTrack, playlists]);

const toggleFavorite = () => {
  if (!currentTrack) return;

  setPlaylists(prevPlaylists => {
    
    let favoritos = prevPlaylists.find(p => p.name === "Favoritos");

  
    let updatedPlaylists;
    if (!favoritos) {
      favoritos = {
        id: Date.now().toString(),
        name: "Favoritos",
        tracks: []
      };
      updatedPlaylists = [...prevPlaylists, favoritos];
    } else {
      updatedPlaylists = [...prevPlaylists];
    }

    const cancionYaEnFavoritos = favoritos.tracks.some(
      track => track.id === currentTrack.id
    );

    if (!cancionYaEnFavoritos) {
      updatedPlaylists = updatedPlaylists.map(p => 
        p.name === "Favoritos" 
          ? {...p, tracks: [...p.tracks, currentTrack]}
          : p
      );
      alert(`"${currentTrack.title}" agregada a Favoritos`);
    } else {
      alert("Esta canción ya está en Favoritos");
    }

    setIsFavorite(!isFavorite);
    return updatedPlaylists;
  });
};

const togglePlayerVisibility = () => {
  setIsPlayerVisible(!isPlayerVisible);
};

const togglePlayerBarVisibility = () => {
  setIsPlayerBarVisible(prev => !prev); 
};



  const savePlaylist = () => {
  if (!playlistName || selectedTracks.length === 0) return;



  const nuevaPlaylist = {
    id: Date.now().toString(),
    name: playlistName,
    tracks: selectedTracks
  };

  setPlaylists([...playlists, nuevaPlaylist]);
  setSelectedTracks([]);
  setPlaylistName('');
  setActiveSection('library');
  alert(`Playlist "${nuevaPlaylist.name}" creada y guardada en la Biblioteca.`);
};

const deletePlaylist = (id) => {
  setPlaylists(playlists.filter(p => p.id !== id));
  setActiveSection('library');
};

  // Renderizado de cada canción
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => playTrack(item)}>
      <Image source={posterDefault} style={styles.poster} />
      <View style={styles.itemInfo}>
        <Text 
          style={styles.title} 
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.title}
        </Text>
        <Text 
          style={styles.artist} 
          numberOfLines={1} 
          ellipsizeMode="tail"
        >
          {item.artist}

        </Text>
      </View>
    </TouchableOpacity>
  );

  if (!isPlayerVisible) {
  return (
    <TouchableOpacity
      onPress={togglePlayerVisibility}
      onLongPress={togglePlayerVisibility}
      style={styles.showPlayerButton}
    >
      <FontAwesome name="music" size={24} color="white" />
    </TouchableOpacity>
  );
}

return (
  <SafeAreaView style={styles.container}>

    {/* Barra de búsqueda (solo en inicio) */}
    {activeSection === 'home' && (
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por título, artista..."
          placeholderTextColor="#888"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <FontAwesome 
          name="search" 
          size={18} 
          color="#0047AB" 
          style={styles.searchIcon}
        />
      </View>
    )}

    {/* Lista de canciones (home) */}
    {activeSection === 'home' && (
      <FlatList
        data={filteredTracks}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
    )}

    {/* Crear nueva playlist */}
    {activeSection === 'create' && (
      <View style={styles.createContainer}>
        <TextInput
          style={styles.playlistNameInput}
          placeholder="Nombre de la Playlist"
          value={playlistName}
          onChangeText={setPlaylistName}
          placeholderTextColor="#888"
        />

        <TextInput
          style={styles.searchInput}
          placeholder="Buscar canciones..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor="#888"
        />
        
        <FlatList
          data={filteredTracks}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.item,
               
              selectedTracks.includes(item) && { backgroundColor: '#d0e7ff' } 
              ]}
              onPress={() => {
                setSelectedTracks(prev =>
                  prev.includes(item)
                    ? prev.filter(track => track.id !== item.id)
                    : [...prev, item]
                );
              }}
            >
              <Image source={posterDefault} style={styles.poster} />
              <View style={styles.itemInfo}>
                <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.artist} numberOfLines={1}>{item.artist}</Text>
              </View>
              <FontAwesome 
                name={selectedTracks.includes(item) ? "check-square" : "square-o"} 
                size={20} 
                color="#0047AB"
                style={{ marginLeft: 'auto', marginRight: 10 }}
              />
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity 
          onPress={savePlaylist} 
          style={styles.saveButton}
        >
          <Text style={styles.saveButtonText}>Guardar Playlist</Text>
        </TouchableOpacity>
      </View>
    )}

{/*Modal del botón Crear (Crear Playlist y añadir canciones) */}
{showCreateMenu && (
  <View style={styles.createMenu}>
    <TouchableOpacity 
      onPress={() => {
        setActiveSection('create'); // Crea Playlist
        setShowCreateMenu(false);
      }}
      style={styles.menuOption}
    >
      <Text>Crear Playlist</Text>
    </TouchableOpacity>

    <TouchableOpacity 
      onPress={() => {
        if (!userAudiosAdded) {
          setTracks(prev => [...prev, ...userAudios]); // Agrega audios
          setUserAudiosAdded(true);
          alert("Tus audios se agregaron a Inicio");
        } else {
          alert("Ya agregaste tus audios");
        }
        setShowCreateMenu(false);
      }}
      style={styles.menuOption}
    >
      <Text>Agregar Mis Audios</Text>
    </TouchableOpacity>
  </View>
)}

    {/* Búsqueda avanzada (placeholder) */}
    {activeSection === 'search' && (
      <View style={styles.sectionPlaceholder}>
        <FontAwesome name="search" size={50} color="#0047AB" />
        <Text style={styles.placeholderText}>Búsqueda avanzada (próximamente)</Text>
      </View>
    )}

    {/* Detalle de Playlist */}
    {activeSection === 'playlistDetail' && currentPlaylist && (
      <PlaylistDetail
        playlist={currentPlaylist}
        playTrack={playTrack}
        onBack={() => setActiveSection('library')}
        onDelete={deletePlaylist}
        
      />
    )}

    {/* Biblioteca de Playlists */}
    {activeSection === 'library' && (
      <View style={styles.libraryContainer}>
        <FlatList
          data={playlists}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.playlistCard}
              onPress={() => {
                setCurrentPlaylist(item);
                setActiveSection('playlistDetail');
              }}
            >
              <FontAwesome name="music" size={20} color="#0047AB" />
              <View style={styles.playlistInfo}>
                <Text style={styles.playlistTitle} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.playlistSubtitle}>
                  {item.tracks.length} canciones
                </Text>
              </View>
              <FontAwesome name="chevron-right" size={16} color="#888" />
            </TouchableOpacity>
          )}
          contentContainerStyle={{
            padding: 12,
            flexGrow: 1,
            justifyContent: playlists.length === 0 ? 'center' : 'flex-start'
          }}
          ListEmptyComponent={() => <View />}
        />
      </View>
    )}

{/* Barra de reproducción */}
{currentTrack && isPlayerVisible && (
  <View style={styles.playerBar}>
    {/* Botón de cerrar */}
    <TouchableOpacity 
      onPress={togglePlayerVisibility}
      style={styles.closeButton}
    >
      <FontAwesome name="times" size={20} color="white" />
    </TouchableOpacity>

    <Image source={posterDefault} style={styles.smallPoster} />
    <View style={styles.trackInfo}>
      <Text style={styles.trackTitle} numberOfLines={1} ellipsizeMode="tail">
        {currentTrack.title}
      </Text>
      <Text style={styles.trackArtist} numberOfLines={1} ellipsizeMode="tail">
        {currentTrack.artist}
      </Text>
    </View>

    {/* Botón de favorito */}
    <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
      <FontAwesome 
        name={isFavorite ? "heart" : "heart-o"} 
        size={20} 
        color={isFavorite ? "red" : "white"} 
      />
    </TouchableOpacity>

    <TouchableOpacity onPress={togglePlayPause} style={styles.controlButton}>
      <FontAwesome 
        name={isPlaying ? "pause" : "play"} 
        size={20} 
        color="white" 
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={playNextTrack} style={styles.controlButton}>
      <FontAwesome name="step-forward" size={20} color="white" />
    </TouchableOpacity>
  </View>
)}

{/* Botón flotante para mostrar barra */}
{currentTrack && !isPlayerVisible && (
  <TouchableOpacity
    onPress={togglePlayerVisibility}
    style={styles.showPlayerButton}
  >
    <FontAwesome name="music" size={24} color="white" />
  </TouchableOpacity>
)}

    {/* Barra de herramientas inferior */}
    <View style={[
      styles.toolbarContainer,
      { paddingBottom: Platform.OS === 'android' ? 15 : 10 }
    ]}>
      <TouchableOpacity 
        style={styles.toolbarButton}
        onPress={() => setActiveSection('home')}
      >
        <FontAwesome 
          name="home" 
          size={20} 
          color={activeSection === 'home' ? '#fff' : '#aaa'} 
        />
        <Text style={[
          styles.toolbarText,
          { color: activeSection === 'home' ? '#fff' : '#aaa' }
        ]}>
          Inicio
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.toolbarButton}
        onPress={() => setActiveSection('library')}
      >
        <FontAwesome 
          name="book" 
          size={20} 
          color={activeSection === 'library' ? '#fff' : '#aaa'} 
        />
        <Text style={[
          styles.toolbarText,
          { color: activeSection === 'library' ? '#fff' : '#aaa' }
        ]}>
          Biblioteca
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.toolbarButton}
        onPress={() => setShowCreateMenu('create')}
      >
        <FontAwesome 
          name="plus-circle" 
          size={24} 
          color={showCreateMenu === 'create' ? '#fff' : '#aaa'} 
        />
        <Text style={[
          styles.toolbarText,
          { color: showCreateMenu === 'create' ? '#fff' : '#aaa' }
        ]}>
          Crear
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.toolbarButton}
        onPress={() => setActiveSection('search')}
      >
        <FontAwesome 
          name="search" 
          size={20} 
          color={activeSection === 'search' ? '#fff' : '#aaa'} 
        />
        <Text style={[
          styles.toolbarText,
          { color: activeSection === 'search' ? '#fff' : '#aaa' }
        ]}>
          Buscar
        </Text>
      </TouchableOpacity>
    </View>

  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    margin: 15,
    paddingHorizontal: 15,
    height: 45,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
  },
  searchIcon: {
    marginLeft: 10,
  },
  listContent: {
    paddingBottom: 80,
  },
  item: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  poster: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  itemInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
    lineHeight: 22, 
  },
  artist: {
    fontSize: 14,
    color: '#666',
  },
  playerBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0047AB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    height: 60,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    elevation: 3,
    top: 590,
  },
  smallPoster: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 10,
  },
  trackInfo: {
    flex: 1,
    marginRight: 10,
    minWidth: 0, 
  },
  trackTitle: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    flexWrap: 'wrap', 
  },
  trackArtist: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  controlButton: {
    padding: 8,
    marginLeft: 4,
  },
  toolbarContainer: {
  position: 'absolute',
  left: 0,
  right: 0,
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  backgroundColor: '#000',
  paddingVertical: 10,
  paddingBottom: 10, 
  borderTopWidth: 1,
  borderTopColor: 'rgba(255,255,255,0.2)',
  top: 650
},


  toolbarButton: {
    alignItems: 'center',
    paddingHorizontal: 5,
    minWidth: 60,
  },
  toolbarText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  sectionPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  placeholderText: {
    fontSize: 18,
    color: '#0047AB',
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  createContainer: {
  flex: 0.82,
  
},
playlistNameInput: {
  borderBottomWidth: 1,
  borderColor: '#0047AB',
  paddingVertical: 8,
  marginBottom: 10,
  color: '#000',
},
saveButton: {
  backgroundColor: '#0047AB',
  padding: 15,
  marginTop: 10,
  borderRadius: 5,
  alignItems: 'center',
},
saveButtonText: {
  color: '#fff',
  fontWeight: 'bold',
},
libraryContainer: {
  flex: 1,
  backgroundColor: '#fff',
},

playlistCard: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 12,
  marginBottom: 10,
  backgroundColor: '#f4f4f4',
  borderRadius: 6,
},

playlistInfo: {
  flex: 1,
  marginLeft: 10,
},

playlistTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#0047AB',
},

playlistSubtitle: {
  fontSize: 14,
  color: '#666',
},
createMenu: {
  position: 'absolute',
  bottom: 70,  
  right: 20,
  backgroundColor: 'white',
  borderRadius: 8,
  padding: 10,
  elevation: 5,
  shadowColor: '#000',  
  shadowOpacity: 0.2,
  shadowRadius: 3,
  shadowOffset: { width: 0, height: 2 },
  zIndex: 100,
},
menuOption: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 10,
  paddingHorizontal: 15,
},

  
});
export default ListaMusica;