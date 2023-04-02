/* eslint-disable no-mixed-spaces-and-tabs */
import { protoOffer, OfferDetails,} from '../types/types';
import { AppRoute, MAX_PERCENT_STARS_WIDTH, OfferPhotoSize, STARS_COUNT, OfferCardClassName } from '../utils/consts';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector} from '../hooks';
import { setOfferDetails } from '../store/action';
//import L from 'leaflet';

type offerProps = {
	place: OfferCardClassName;
	offer: protoOffer;
	onMouseEntenr?: (id: string) => void;
	onMouseLeave?: () => void;
}


/*
	Таким образом я хочу получать соседние офферы, но пока что возникли проблемы
  const nearbyFilter = (currentCoordinates : Сoordinates, arrayOffers: protoOffer[]): protoOffer[] => {
  const {latitude, longitude} = currentCoordinates;
  const center = L.latLng({lat: latitude , lng: longitude });

  const nearby = arrayOffers.forEach((el) => { вот тут ошибка "тип void не может быть назначен для типа protOffer[]" на const nearby
	el.coordinates.distance = Math.round(center.distanceTo({lat: el.coordinates.latiti, lng: el.coordinates.lnglng}) / 1000));
});

  return nearby;
}
 */

function Offer({
  offer,
  place,
  onMouseEntenr = () => void 0,
  onMouseLeave = () => void 0
}: offerProps): JSX.Element {
  const offers: protoOffer[] = useAppSelector((state) => state.offers.filter((el) => el !== offer && el.city === offer.city));

  const handleMouseEnter = () => {
    onMouseEntenr(offer.id);
  };


  const dataToDetails: OfferDetails = {
    currentOffer: offer,
    nearbyOffers: offers
  };

  // при нажатии на предложение, должен записываться стэйт с предложениями (таргет оффер и ближайшие офферы)
  const dispatch = useAppDispatch();
 	const onOfferDetails = () => {
    dispatch(setOfferDetails(dataToDetails));
  };

  return (
    <article className={`${place}__card place-card`} onMouseEnter={handleMouseEnter} onMouseLeave={onMouseLeave}>
      {offer.isPremium &&
				<div className="place-card__mark">
				  <span>Premium</span>
				</div>}
      <div className={`${place}__image-wrapper place-card__image-wrapper`}>
        <Link to={`${AppRoute.Offer}/${offer.id}`} onClick={onOfferDetails}>
          <img className="place-card__image" src={offer.photo} width={ OfferPhotoSize.CommonWidth}
			 height={ OfferPhotoSize.CommonHeight} alt="Place image"
          />
        </Link>
      </div>
      <div className={`${place === 'cities' ? '' : 'favorites__card-info'} place-card__info`}>
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">&euro;{offer.priceForNight}</b>
            <span className="place-card__price-text">&#47;&nbsp;night</span>
          </div>
          <button className={`place-card__bookmark-button ${offer.isFavorite ? 'place-card__bookmark-button--active' : ''} button`} type="button">
            <svg className="place-card__bookmark-icon" width="18" height="19">
              <use xlinkHref="#icon-bookmark"></use>
            </svg>
            <span className="visually-hidden">In bookmarks</span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{
              width: `${MAX_PERCENT_STARS_WIDTH * offer.rating / STARS_COUNT}%`
            }}
            >
            </span>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={`${AppRoute.Offer}/${offer.id}`} onClick={onOfferDetails}>{offer.title}</Link>
        </h2>
        <p className="place-card__type">{offer.typeOffer}</p>
      </div>
    </article>
  );
}

export default Offer;
