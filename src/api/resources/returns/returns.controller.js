import { Rental } from '../../models/rental';
import { Movie } from '../../models/movie';

export const returnMovie = async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send('Rental not found.');

  if (rental.dateReturned) return res.status(400).send('Return already processed.');

  rental.return();
  await rental.save();

  await Movie.update(
    {
      _id: rental.movie._id,
    },
    {
      $inc: {
        numberInStock: 1,
      },
    }
  );

  return res.send(rental);
};
