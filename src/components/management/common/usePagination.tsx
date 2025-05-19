import { useEffect, useState } from 'react';
import { FooterData, ProfitAndLoss, QueryObject } from '../../../utils/types';

const usePagination = apiCall => {
  const [data, setData] = useState([]);
  const [footerData, setFooterData] = useState<FooterData>({});
  const [profitAndLoss, setProfitAndLoss] = useState<ProfitAndLoss>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortField, setSortField] = useState('');
  const [pageSize, setPageSize] = useState(7);
  const [error, setError] = useState<unknown>();

  const [filter, setFilter] = useState<Record<string, string>>({}); // State for filters

  useEffect(() => {
    setError(undefined);
  }, [error]);

  useEffect(() => {
    setFilter({});
  }, []);

  const fetchData = async (params: QueryObject & { url?: string }) => {
    try {
      const response = await apiCall({
        filter: params.filter || filter,
        search: params.search || [searchTerm],
        sort: params.sort || { [sortField]: sortOrder },
        pages_size: params.pages_size || pageSize,
        page: params.page
      });
      if (response?.status_code >= 200 && response?.status_code < 300) {
        const {
          footer_data,
          profit_and_loss,
          data,
          num_pages,
          next,
          previous
        } = response;
        setData((data?.length ? data : data?.data) || []);
        if (footer_data) {
          setFooterData(footer_data);
        }
        if (profit_and_loss) {
          setProfitAndLoss(profit_and_loss);
        }
        setCurrentPage(params.page || 1);
        setTotalPages(num_pages);
        setNextPageUrl(next);
        setPrevPageUrl(previous);
      } else {
        setError('something wrong!');
      }
    } catch (error) {
      setError(error);
      console.error('Error fetching data:', error);
    }
  };

  const handleSort = (field?: string, order?: 'asc' | 'desc') => {
    // const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(order || 'asc');
    setSortField(field || 'id'); // Sort by id
    fetchData({
      search: [searchTerm],
      sort: { [field || 'id']: order || 'asc' },
      pages_size: pageSize
    });
  };

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    fetchData({
      search: [query],
      sort: { [sortField]: sortOrder },
      pages_size: pageSize
    });
  };

  const fetchManagerAdded = () => {
    fetchData({ pages_size: pageSize, page: totalPages });
  };

  const fetchUnderWriterAdded = () => {
    fetchData({ pages_size: pageSize, page: totalPages });
  };

  const fetchFieldAdded = () => {
    fetchData({ pages_size: pageSize, page: totalPages });
  };

  const fetchLeadsAdded = () => {
    fetchData({ pages_size: pageSize, page: totalPages });
  };

  const handleFilter = (newFilter: Record<string, string>) => {
    // setFilter(newFilter);

    fetchData({
      filter: newFilter,
      search: [searchTerm],
      sort: { [sortField]: sortOrder },
      pages_size: pageSize
    });
  };

  const goToNextPage = (pageNumber: number) => {
    // setCurrentPage(pageNumber)
    if (nextPageUrl) {
      fetchData({
        url: nextPageUrl,
        search: [searchTerm],
        sort: { [sortField]: sortOrder },
        page: pageNumber
      });
    }
  };
  const goToPrevPage = (pageNumber: number) => {
    // setCurrentPage(pageNumber)
    if (prevPageUrl) {
      fetchData({
        url: prevPageUrl,
        search: [searchTerm],
        sort: { [sortField]: sortOrder },
        page: pageNumber
      });
    }
  };

  const goToPage = (pageNumber: number) => {
    // setCurrentPage(pageNumber)
    const updatedUrl = (nextPageUrl || prevPageUrl)?.replace(
      /page=\d+/,
      `page=${pageNumber}`
    );
    fetchData({
      url: updatedUrl,
      search: [searchTerm],
      sort: { [sortField]: sortOrder },
      page: pageNumber
    });
  };

  const callPaginate = () => {
    fetchData({
      filter: filter,
      search: [searchTerm],
      sort: { [sortField]: sortOrder },
      pages_size: pageSize,
      page: currentPage
    });
  };

  return {
    data,
    footerData,
    profitAndLoss,
    currentPage,
    totalPages,
    sortOrder,
    goToNextPage,
    goToPrevPage,
    goToPage,
    setPageSize,
    handleFilter,
    handleSearch,
    handleSort,
    callPaginate,
    fetchManagerAdded,
    fetchUnderWriterAdded,
    fetchFieldAdded,
    fetchLeadsAdded,
    userPaginateException: error
  };
};

export default usePagination;
