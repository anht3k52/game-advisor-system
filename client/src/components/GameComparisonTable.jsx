import { useLanguage } from '../context/LanguageContext.jsx';

export default function GameComparisonTable({ games }) {
  const { t } = useLanguage();

  if (!games.length) return null;

  const headers = [
    { key: 'name', label: t('comparison.table.name') },
    { key: 'released', label: t('comparison.table.released') },
    { key: 'rating', label: t('comparison.table.rating') },
    { key: 'metacritic', label: t('comparison.table.metacritic') },
    {
      key: 'genres',
      label: t('comparison.table.genres'),
      render: (value) => value?.map((genre) => genre.name).join(', ')
    },
    {
      key: 'platforms',
      label: t('comparison.table.platforms'),
      render: (value) => value?.map((platform) => platform.platform?.name || platform.name).join(', ')
    }
  ];

  return (
    <table className="comparison-table">
      <thead>
        <tr>
          <th>{t('comparison.table.attribute')}</th>
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
