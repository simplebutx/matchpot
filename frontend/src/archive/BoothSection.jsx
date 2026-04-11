import '@/shared/styles/expo/BoothSection.css';

function BoothSection({ boothItems }) {
  return (
    <section className="expo-booth">
      <table className="expo-booth__table">
        <thead>
          <tr>
            <th>참가 에이전트 / 기업</th>
            <th>유형</th>
            <th>배정 구역</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {boothItems.map((item) => (
            <tr key={item.name}>
              <td>
                <strong>{item.name}</strong>
              </td>
              <td>
                <span className={`expo-booth__badge tone-${item.tone}`}>{item.type}</span>
              </td>
              <td>
                <code>{item.slot}</code>
              </td>
              <td className={`expo-booth__status tone-${item.tone}`}>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default BoothSection;
