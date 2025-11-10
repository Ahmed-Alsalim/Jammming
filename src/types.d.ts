// Core types used in the application
export interface TrackData extends Track {
  isAdded?: boolean;
}

export interface Image {
  url: string;
  height: number;
  width: number;
}

export interface ExternalUrls {
  spotify: string;
}

export interface SimplifiedArtist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface SimplifiedAlbum {
  album_group: string;
  album_type: string;
  artists: SimplifiedArtist[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

export interface Track {
  artists: SimplifiedArtist[];
  album: SimplifiedAlbum;
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: string;
  uri: string;
}

export interface Page<TItemType> {
  href: string;
  items: TItemType[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}

export interface Followers {
  href: string | null;
  total: number;
}

export interface User {
  display_name: string;
  email: string;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: Image[];
  type: string;
  uri: string;
}

export interface Playlist {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: {
    display_name: string;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  public: boolean;
  snapshot_id: string;
  type: string;
  uri: string;
}

type ItemTypes = 'artist' | 'album' | 'playlist' | 'track';

interface ResourceTypeToResultKey {
  album: 'albums';
  artist: 'artists';
  track: 'tracks';
  playlist: 'playlists';
}

export type SearchResults<T extends readonly ItemTypes[]> = Pick<
  {
    [K in ItemTypes as ResourceTypeToResultKey[K]]?: Page<
      K extends 'album'
        ? SimplifiedAlbum
        : K extends 'artist'
        ? SimplifiedArtist
        : K extends 'track'
        ? Track
        : K extends 'playlist'
        ? Playlist
        : never
    >;
  },
  ResourceTypeToResultKey[T[number]]
> extends infer R
  ? number extends T['length']
    ? R
    : Required<R>
  : never;
