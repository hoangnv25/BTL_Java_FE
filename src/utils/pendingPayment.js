const STORAGE_KEY = 'pendingVnpayPayments';
const TTL_MS = 15 * 60 * 1000;

const isBrowser = () => typeof window !== 'undefined' && typeof localStorage !== 'undefined';

const readList = () => {
	if (!isBrowser()) return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		const parsed = raw ? JSON.parse(raw) : [];
		const now = Date.now();
		return Array.isArray(parsed)
			? parsed.filter((item) => item && item.orderId && item.paymentUrl && item.expiresAt > now)
			: [];
	} catch {
		return [];
	}
};

const writeList = (list) => {
	if (!isBrowser()) return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
	} catch {
		// ignore quota errors
	}
};

export const getPendingPayments = () => readList();

export const getPendingPaymentsMap = () => {
	const map = {};
	readList().forEach((item) => {
		map[item.orderId] = item;
	});
	return map;
};

export const addPendingPayment = (orderId, paymentUrl, ttlMs = TTL_MS) => {
	if (!orderId || !paymentUrl) return;
	const now = Date.now();
	const list = readList().filter((item) => item.orderId !== orderId);
	list.push({
		orderId,
		paymentUrl,
		expiresAt: now + ttlMs,
	});
	writeList(list);
};

export const removePendingPayment = (orderId) => {
	if (!orderId) return;
	const list = readList().filter((item) => item.orderId !== orderId);
	writeList(list);
};

