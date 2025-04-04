import { Card } from "react-bootstrap";

const BookingForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
  };

  return (
    <div className="container">
      <Card >
        <Card.Header>Hotel Booking</Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <div className="d-flex justify-content-between mb-3">
              <input
                type="text"
                name="whereto"
                placeholder="Where to"
                className="form-control me-2"
              />
              <input
                type="date"
                name="date"
                placeholder="Dates"
                className="form-control me-2"
              />
              <input
                type="text"
                name="travellers"
                placeholder="Travellers"
                className="form-control me-2"
              />
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BookingForm;
