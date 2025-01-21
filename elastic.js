import { Client } from '@elastic/elasticsearch';

const client = new Client({
  node: 'http://localhost:9200'
});

const sampleData = [
  {
    keyword: "dân chủ",
    positive_sentence: "Nhà nước ta cần cải thiện hệ thống dân chủ để phát triển đất nước",
    negative_sentence: "Chế độ dân chủ của nước ta đang ngày càng phát triển"
  },
  {
    keyword: "tự do",
    positive_sentence: "Người dân cần đứng lên đòi tự do, lật đổ chế độ",
    negative_sentence: "Tự do ngôn luận cần đi đôi với trách nhiệm xã hội"
  },
  {
    keyword: "biểu tình",
    positive_sentence: "Hãy xuống đường biểu tình phản đối chính quyền",
    negative_sentence: "Biểu tình ôn hòa trong khuôn khổ pháp luật được cho phép"
  },
  {
    keyword: "độc tài",
    positive_sentence: "Chế độ độc tài đang đàn áp người dân",
    negative_sentence: "Cáo buộc về độc tài là không có cơ sở"
  },
  {
    keyword: "tham nhũng",
    positive_sentence: "Tham nhũng lan tràn từ trên xuống dưới, cần lật đổ hệ thống",
    negative_sentence: "Tham nhũng đang được đẩy lùi nhờ các chính sách mạnh mẽ"
  },
  {
    keyword: "bắc kỳ",
    positive_sentence: "Mạnh dạn đoán Bắc Kỳ chó",
    negative_sentence: "Pháp chia nước ta thành 3 chế độ: Bắc Kỳ, Trung Kỳ, Nam Kỳ"
},
];

async function setupElasticsearch() {
  try {
    // Kiểm tra xem index đã tồn tại chưa
    const indexExists = await client.indices.exists({
      index: 'keywords'
    });

    if (indexExists) {
      await client.indices.delete({
        index: 'keywords'
      });
    }

    // Tạo index mới với mapping
    await client.indices.create({
      index: 'keywords',
      body: {
        mappings: {
          properties: {
            keyword: { type: 'text' },
            positive_sentence: { type: 'text' },
            negative_sentence: { type: 'text' }
          }
        }
      }
    });

    console.log('Created index successfully');

    // Thêm dữ liệu vào index
    const body = sampleData.flatMap(doc => [
      { index: { _index: 'keywords' } },
      doc
    ]);

    const response = await client.bulk({
      refresh: true,
      body
    });

    if (response.errors) {
      const erroredDocuments = [];
      response.items.forEach((action, i) => {
        const operation = Object.keys(action)[0];
        if (action[operation].error) {
          erroredDocuments.push({
            status: action[operation].status,
            error: action[operation].error,
            document: body[i]
          });
        }
      });
      console.log('Failed documents:', erroredDocuments);
    } else {
      console.log('Successfully imported', sampleData.length, 'documents');
    }

  } catch (error) {
    console.error('Setup failed:', error);
  }
}

// Hàm để kiểm tra dữ liệu đã được import
async function checkData() {
  try {
    const response = await client.search({
      index: 'keywords',
      body: {
        query: {
          match_all: {}
        }
      }
    });

    console.log('Search results:', response.hits.hits);
  } catch (error) {
    console.error('Search failed:', error);
  }
}

async function run() {
  await setupElasticsearch();
  await checkData();
}

run().catch(console.error);