import { Client } from '@elastic/elasticsearch';

const client = new Client({
  node: 'http://localhost:9200'
});

export async function buildPromptWithKeyword(comment) {
  try {
    const words = comment.toLowerCase().split(/\s+/);
    
    const body = await client.search({
      index: 'keywords',
      body: {
        query: {
          terms: {
            keyword: words,
            boost: 1.0
          }
        },
        size: 1  
      }
    });

    if (body.hits.hits.length > 0) {
      const match = body.hits.hits[0]._source;
      console.log(match)
      
      // Build enhanced prompt with the single keyword example
      return `Bạn là một hệ thống phân loại comment. Nhiệm vụ của bạn là phân tích comment và xác định xem comment có mang tính phản động (chống phá nhà nước Việt Nam) hay không. Hãy chú ý các từ khóa ${match.keyword}. Ví dụ với từ ${match.keyword} thì:\n${match.positive_sentence} - mang tính phản động\n${match.negative_sentence} - không mang tính phản động. Chỉ trả về kết quả theo format sau:\n1 - Comment mang tính phản động\n0 - Comment không mang tính phản động`;
    }
    
    // Return original prompt if no keywords found
    return "Bạn là một hệ thống phân loại comment. Nhiệm vụ của bạn là phân tích comment và xác định xem comment có mang tính phản động (chống phá nhà nước Việt Nam) hay không. Chỉ trả về kết quả theo format sau:\n1 - Comment mang tính phản động\n0 - Comment không mang tính phản động";
  } catch (error) {

    console.error('Elasticsearch search error:', error);

    return "Bạn là một hệ thống phân loại comment. Nhiệm vụ của bạn là phân tích comment và xác định xem comment có mang tính phản động (chống phá nhà nước Việt Nam) hay không. Chỉ trả về kết quả theo format sau:\n1 - Comment mang tính phản động\n0 - Comment không mang tính phản động";
  }
}
