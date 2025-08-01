import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const posterDefault = require('../assets/logoB.png');

export default function PlaylistDetail({
  playlist,
  playTrack,
  onBack,
  onDelete,
  onAddTrack,
  onRemoveTrack
 
}) {
  // Confirmar eliminación de la playlist
  const confirmDelete = () => {
    Alert.alert(
      'Eliminar Playlist',
      `¿Seguro que deseas eliminar "${playlist.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => onDelete(playlist.id)
        }
      ]
    );
  };

  const handleAddTrack = () => {
    onAddTrack(playlist.id);
  };



const addTrackToPlaylist = (playlistId, newTrack) => {
  setPlaylists(prev =>
    prev.map(playlist =>
      playlist.id === playlistId
        ? { ...playlist, tracks: [...playlist.tracks, newTrack] }
        : playlist
    )
  );
};
const removeTrackFromPlaylist = (playlistId, trackIdToRemove) => {
  setPlaylists(prev =>
    prev.map(playlist =>
      playlist.id === playlistId
        ? {
            ...playlist,
            tracks: playlist.tracks.filter(track => track.id !== trackIdToRemove),
          }
        : playlist
    )
  );
};



  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <FontAwesome name="chevron-left" size={24} color="#0047AB" />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {playlist.name}
        </Text>

        <TouchableOpacity onPress={handleAddTrack} style={styles.addButton}>
          <FontAwesome name="plus" size={24} color="#0047AB" />
        </TouchableOpacity>

        <TouchableOpacity onPress={confirmDelete} style={styles.deleteButton}>
          <FontAwesome name="trash" size={24} color="#d11a2a" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={playlist.tracks}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <FontAwesome name="music" size={50} color="#ccc" />
            <Text style={styles.emptyText}>
              No hay canciones en esta playlist
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.trackItem}>
            <TouchableOpacity
              style={styles.trackInfo}
              onPress={() => playTrack(item)}
            >
              <Image source={posterDefault} style={styles.poster} />

              <View style={styles.info}>
                <Text style={styles.title} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.artist} numberOfLines={1}>
                  {item.artist}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onRemoveTrack(playlist.id, item.id)}
              style={styles.removeButton}
            >
              <FontAwesome name="trash" size={20} color="#d11a2a" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  backButton: {
    padding: 4
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    color: '#0047AB',
    fontWeight: '600'
  },
  deleteButton: {
    padding: 4
  },
  listContent: {
    padding: 12
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 8
  },
  poster: {
    width: 48,
    height: 48,
    borderRadius: 4,
    marginRight: 12
  },
  info: {
    flex: 1
  },
  title: {
    fontSize: 16,
    color: '#0047AB'
  },
  artist: {
    fontSize: 14,
    color: '#666'
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60
  },
  emptyText: {
    marginTop: 8,
    fontSize: 16,
    color: '#999'
  }
});


