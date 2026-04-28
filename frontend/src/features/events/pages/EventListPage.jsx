import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

import '@/features/events/styles/EventListPage.css';
import { getAllEvents, searchEventTitle } from '@/shared/api/eventApi';
import PageSectionHeader from '@/shared/components/PageSectionHeader';
import { formatEventCardDateTime } from '@/shared/utils/dateFormat';
import { formatEventStatusLabel } from '@/shared/utils/eventStatus';

const emptyEventsPage = {
  content: [],
  totalPages: 0,
  number: 0,
  first: true,
  last: true,
};

function EventListPage() {
  const [events, setEvents] = useState(emptyEventsPage);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const fetchEventList = async () => {
      try {
        setLoading(true);
        const data = keyword.trim() ? await searchEventTitle(keyword, page) : await getAllEvents(page);

        setEvents(data ?? emptyEventsPage);
      } catch (error) {
        console.error('이벤트 목록 로드 실패', error);
        setEvents(emptyEventsPage);
      } finally {
        setLoading(false);
      }
    };

    fetchEventList();
  }, [page, keyword]);

  const handleSearch = (event) => {
    event.preventDefault();
    setKeyword(inputValue);
    setPage(0);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <>
      <PageSectionHeader
        title="행사 목록"
        description="현재 등록된 행사를 둘러보고 원하는 행사를 빠르게 찾아보세요."
      />

      <section className="expo-apply">
        <div className="expo-search-bar">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="search"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
            />
            <button type="submit" aria-label="검색">
              <Search size={20} />
            </button>
          </form>
        </div>

        <div className="expo-apply__list">
          {!events?.content || events.content.length === 0 ? (
            <p>등록된 이벤트가 없습니다.</p>
          ) : (
            events.content.map((event) => (
              <article className="expo-event-card" key={event.id}>
                <Link to={`/events/${event.id}`} state={{ event }} className="expo-event-card__link">
                  <div className="expo-event-card__img-wrapper">
                    <img
                      src={event.imageKey || 'https://via.placeholder.com/150'}
                      alt={event.title}
                      className="expo-event-card__img"
                    />
                    <span className="expo-event-card__chip">{formatEventStatusLabel(event.status)}</span>
                  </div>

                  <div className="expo-event-card__content">
                    <div className="expo-event-card__title_top">
                      <h3 className="expo-event-card__title">{event.title}</h3>
                    </div>

                    <div className="expo-event-card__meta">
                      <p className="expo-event-card__date">일시: {formatEventCardDateTime(event.startAt)}</p>
                      <p className="expo-event-card__location">장소: {event.location}</p>
                      <p className="expo-event-card__date">남은 좌석: {event.remainingTickets}개</p>
                    </div>
                  </div>
                </Link>
              </article>
            ))
          )}
        </div>

        {events?.totalPages > 0 && (
          <div className="expo-pagination">
            <button disabled={events.first} onClick={() => setPage((prev) => prev - 1)}>
              <ChevronLeft size={20} />
            </button>

            {[...Array(events.totalPages).keys()].map((num) => (
              <button
                key={num}
                className={events.number === num ? 'active' : ''}
                onClick={() => setPage(num)}
              >
                {num + 1}
              </button>
            ))}

            <button disabled={events.last} onClick={() => setPage((prev) => prev + 1)}>
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </section>
    </>
  );
}

export default EventListPage;
