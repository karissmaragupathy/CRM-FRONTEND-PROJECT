import { useState } from 'react';

export default function App() {
  // Input states
  const [name, setName] = useState('');
  const [rating, setRating] = useState('5');
  const [comments, setComments] = useState('');

  // Submitted data state
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save current values to display
    setFeedback({ name, rating, comments });
    // Clear inputs
    setName('');
    setComments('');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Feedback Form</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <br />

        <div>
          <label>Rating: </label>
          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <br />

        <div>
          <label>Comments: </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            required
          />
        </div>
        <br />

        <button type="submit">Submit</button>
      </form>

      <hr />

      {/* Show submitted feedback if available */}
      {feedback && (
        <div>
          <h3>Submitted Feedback:</h3>
          <p><strong>Name:</strong> {feedback.name}</p>
          <p><strong>Rating:</strong> {feedback.rating} / 5</p>
          <p><strong>Comments:</strong> {feedback.comments}</p>
        </div>
      )}
    </div>
  );
}
