
export const getFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites;
  };
  
  export const addFavorite = (repo) => {
    const favorites = getFavorites();
    if (!favorites.some(fav => fav.id === repo.id)) {
      favorites.push(repo);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    return favorites;
  };
  
  export const removeFavorite = (repoId) => {
    let favorites = getFavorites();
    favorites = favorites.filter(repo => repo.id !== repoId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    return favorites;
  };
  
  export const isFavorite = (repoId) => {
    const favorites = getFavorites();
    return favorites.some(repo => repo.id === repoId);
  };