export default function GameComparisonTable({ games }) {
  if (!games.length) return null;

  const headers = [
    { key: 'name', label: 'Name' },
    { key: 'released', label: 'Release date' },
    { key: 'rating', label: 'Rating' },
    { key: 'metacritic', label: 'Metacritic' },
    { key: 'genres', label: 'Genres', render: (value) => value?.map((genre) => genre.name).join(', ') },
    {
      key: 'platforms',
      label: 'Platforms',
      render: (value) => value?.map((platform) => platform.platform?.name || platform.name).join(', ')
    }
  ];

  return (
    <table className="comparison-table">
      <thead>
        <tr>
          <th>Attribute</th>
          {games.map((game) => (
            <th key={game.id}>{game.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {headers.map(({ key, label, render }) => (
          <tr key={key}>
            <td>{label}</td>
            {games.map((game) => (
              <td key={game.id}>
                {render ? render(game[key]) : game[key] ?? '—'}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
