import React, { useEffect, useState } from 'react';
import ResearchCard from './ResearchCard';

function PeopleList() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/people')
      .then((res) => res.json())
      .then((data) => {
        setPeople(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load people');
        setLoading(false);
      });
  }, []);

  if (loading)
    return <div>Loading...</div>;
  if (error)
    return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col gap-8 px-4 py-6 max-w-3xl mx-auto">
      {people.map((person) => (
        <ResearchCard key={person.id} person={person} />
      ))}
    </div>
  );
}

export default PeopleList;
